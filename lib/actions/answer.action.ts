"use server"

import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"
import Question from "@/database/question.model"
import User from "@/database/user.model"
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "@/lib/actions/shared"
import { connectToDatabase } from "@/lib/mongoose"
import { revalidatePath } from "next/cache"

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase()
    const { content, author, question, path } = params
    const answer = await Answer.create({ content, author, question })

    const questionObj = await Question.findByIdAndUpdate(
      question,
      { $push: { answers: answer._id } },
      { new: true }
    )
    // TODO: add interaction
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: answer._id,
      tags: questionObj.tags,
    })

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } })

    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase()
    const { questionId, filter } = params

    let sortOptions: any = { createdAt: -1 }
    switch (filter) {
      case "highestUpvotes":
        break
      case "lowestUpvotes":
        break
      case "recent":
        sortOptions = { createdAt: -1 }
        break
      case "old":
        sortOptions = { createdAt: 1 }
        break
      default:
        break
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)

    if (filter === "highestUpvotes") {
      answers.sort((a, b) => b.upvotes.length - a.upvotes.length)
    }
    if (filter === "lowestUpvotes") {
      answers.sort((a, b) => a.upvotes.length - b.upvotes.length)
    }
    return { answers }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function upvotesAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase()
    const { answerId, hasDownvoted, hasUpvoted, path, userId } = params

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) throw new Error("Answer not found")
    // create interaction record for user's upvote action
    // increase author's reputation

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    })

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    })

    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function downvotesAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase()
    const { answerId, hasDownvoted, hasUpvoted, path, userId } = params

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) throw new Error("Answer not found")
    // create interaction record for user's upvote action
    // inceare author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    })

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    })
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    await connectToDatabase()
    const { answerId, path } = params
    const answer = await Answer.findById(answerId)
    if (!answer) throw new Error("Answer not found")

    await Answer.deleteOne({ _id: answerId })
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    )
    await Interaction.deleteMany({ answer: answerId })
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}
