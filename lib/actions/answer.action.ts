"use server"

import Answer from "@/database/answer.model"
import Question from "@/database/question.model"
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "@/lib/actions/shared"
import { connectToDatabase } from "@/lib/mongoose"
import { revalidatePath } from "next/cache"

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase()
    const { content, author, question, path } = params
    const answer = await Answer.create({ content, author, question })

    await Question.findByIdAndUpdate(
      question,
      { $push: { answers: answer._id } },
      { new: true }
    )
    // TODO: add interaction

    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase()
    const { questionId } = params
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 })

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
    // inceare author's reputation
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
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}
