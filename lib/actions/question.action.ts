"use server"

import Question from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"
import console from "console"

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()
    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort({ createdAt: -1 })
    console.log("anhtuan")
    return { questions }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase()
    const { questionId } = params
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })

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
    // inceare author's reputation
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
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}
