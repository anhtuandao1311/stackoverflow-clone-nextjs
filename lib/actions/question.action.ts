"use server"

import Question, { IQuestion } from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"
import console from "console"
import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"
import { FilterQuery } from "mongoose"

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()
    const { searchQuery, filter, page = 1, pageSize = 10 } = params

    // calculate number of questions to skip based on page number and page size
    const skipAmount = (page - 1) * pageSize
    let query: FilterQuery<typeof Question> = {}
    if (searchQuery) {
      query = { title: { $regex: new RegExp(searchQuery, "i") } }
    }

    let sortOptions: any = { createdAt: -1 }
    switch (filter) {
      case "newest":
        break
      case "recommended":
        break
      case "frequent":
        sortOptions = { views: -1 }
        break
      case "unanswered":
        query.answers = { $size: 0 }
        break
      default:
        break
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    const totalQuestions = await Question.countDocuments(query)
    const numberOfPages = Math.ceil(totalQuestions / pageSize)
    // console.log(questions)
    return { questions, numberOfPages }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase()
    const { questionId } = params
    if (questionId === "edit") return null
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
    if (!question) throw new Error("Question not found")
    return question
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase()
    const { title, content, tags, author, path } = params
    const question = await Question.create({
      title,
      content,
      author,
    })

    // find tags and add question to tag, if new tag then create tag and add question to it
    const tagDocuments = []
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag)
    }

    // add above tags to question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    })

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    })

    // increase reputation by 5
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } })

    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function upvotesQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase()
    const { questionId, hasDownvoted, hasUpvoted, path, userId } = params

    let updateQuery = {}

    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } }
    } else if (hasDownvoted) {
      updateQuery = {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      }
    } else {
      updateQuery = { $addToSet: { upvotes: userId } }
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })

    if (!question) throw new Error("Question not found")
    // create interaction record for user's upvote action
    // increase author's reputation
    // increase author's reputation by +1/-1 for upvoting/revoking upvote
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    })

    // increase author's reputation by 10/-10 for receiving upvote/downvote
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    })

    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function downvotesQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase()
    const { questionId, hasDownvoted, hasUpvoted, path, userId } = params

    let updateQuery = {}

    if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId } }
    } else if (hasUpvoted) {
      updateQuery = {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      }
    } else {
      updateQuery = { $addToSet: { downvotes: userId } }
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })

    if (!question) throw new Error("Question not found")
    // create interaction record for user's upvote action
    // inceare author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    })

    // increase author's reputation by 10/-10 for receiving upvote/downvote
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    })
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase()
    const { questionId, path } = params
    const question = await Question.findById(questionId).populate("tags", "_id")
    if (!question) throw new Error("Question not found")

    await Question.deleteOne({ _id: questionId })
    await Answer.deleteMany({ question: questionId })
    await Interaction.deleteMany({ question: questionId })

    const tagIds = question.tags.map((tag: any) => tag._id)
    for (const tagId of tagIds) {
      const tag = await Tag.findByIdAndUpdate(
        tagId,
        { $pull: { questions: questionId } },
        { new: true }
      )
      if (tag.questions.length === 0) {
        await Tag.findByIdAndDelete(tagId)
      }
    }
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase()
    const { questionId, title, content, path } = params

    // add above tags to question
    const question = await Question.findById(questionId)
    if (!question) throw new Error("Question not found")
    question.title = title
    question.content = content

    await question.save()
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getTopQuestions() {
  try {
    await connectToDatabase()
    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5)
    return questions
  } catch (err) {
    console.log(err)
    throw err
  }
}
