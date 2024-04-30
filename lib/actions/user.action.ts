"use server"

import User, { IUser } from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "@/lib/actions/shared"
import { revalidatePath } from "next/cache"
import console, { count } from "console"
import Question, { IQuestion } from "@/database/question.model"
import { FilterQuery } from "mongoose"
import Tag from "@/database/tag.model"
import Answer from "@/database/answer.model"
import { assignBadges } from "@/lib/utils"
import { BadgeCriteriaType } from "@/types"

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase()

    const { page = 1, pageSize = 10, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize
    let query: FilterQuery<typeof User> = {}
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ]
    }

    let sortOptions: any = {}
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 }
        break
      case "old_users":
        sortOptions = { joinedAt: 1 }
        break
      case "top_contributors":
        sortOptions = { reputation: -1 }
        break
      default:
        break
    }

    const users = await User.find<IUser>(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)
    const totalUsers = await User.countDocuments(query)
    const numberOfPages = Math.ceil(totalUsers / pageSize)
    return { users, numberOfPages }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase()
    const { userId } = params
    const user = await User.findOne<IUser>({ clerkId: userId })
    if (!user) throw new Error("User not found")
    return user
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(params)

    return newUser
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase()

    const { clerkId, updateData, path } = params

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    })

    revalidatePath(path)
    return updatedUser
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase()

    const { clerkId } = params

    const deletedUser = await User.findOneAndDelete({ clerkId })

    if (!deletedUser) {
      throw new Error("User not found")
    }

    // deleted all things related to user

    // const userQuestionIds = await Question.find({
    //   author: deletedUser._id,
    // }).distinct("_id")

    await Question.deleteMany({ author: deletedUser._id })

    return deletedUser
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function ToggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase()

    const { userId, questionId, path } = params
    const user = await User.findById(userId)
    if (!user) throw new Error("User not found")
    const isSavedQuestion = user.saved.includes(questionId)
    if (isSavedQuestion) {
      await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } })
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { saved: questionId } })
    }
    revalidatePath(path)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase()
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {}

    let sortOptions: any = { createdAt: -1 }
    switch (filter) {
      case "most_recent":
        break
      case "oldest":
        sortOptions = { createdAt: 1 }
        break
      case "most_voted":
        break
      case "most_viewed":
        sortOptions = { views: -1 }
        break
      case "most_answered":
        break
      default:
        break
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })
    if (!user) throw new Error("User not found")

    if (filter === "most_voted") {
      user.saved.sort(
        (a: IQuestion, b: IQuestion) => b.upvotes.length - a.upvotes.length
      )
    } else if (filter === "most_answered") {
      user.saved.sort(
        (a: IQuestion, b: IQuestion) => b.answers.length - a.answers.length
      )
    }

    const fullUser = await User.findOne({ clerkId })
    const totalSavedQuestions = fullUser.saved.length

    const numberOfPages = Math.ceil(totalSavedQuestions / pageSize)

    return { questions: user.saved, numberOfPages }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase()
    const { userId } = params
    const user = await User.findOne<IUser>({ clerkId: userId })
    if (!user) throw new Error("User not found")

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ])

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ])

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ])

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ]

    const badgeCounts = assignBadges({ criteria })

    return { user, totalQuestions, totalAnswers, badgeCounts }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase()
    const { userId, page = 1, pageSize = 10 } = params
    const user = await User.findById<IUser>(userId)
    if (!user) throw new Error("User not found")

    const totalQuestions = await Question.countDocuments({ author: user._id })

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture")

    return { questions: userQuestions, totalQuestions }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase()
    const { userId, page = 1, pageSize = 10 } = params
    const user = await User.findById<IUser>(userId)
    if (!user) throw new Error("User not found")

    const totalAnswers = await Answer.countDocuments({ author: user._id })

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture")

    return { answers: userAnswers, totalAnswers }
  } catch (err) {
    console.log(err)
    throw err
  }
}
