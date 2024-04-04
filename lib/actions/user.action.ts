"use server"

import User, { IUser } from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "@/lib/actions/shared"
import { revalidatePath } from "next/cache"
import console from "console"
import Question from "@/database/question.model"
import { FilterQuery } from "mongoose"
import Tag from "@/database/tag.model"

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase()

    // const { page = 1, pageSize = 20, filter, searchQuery } = params
    const users = await User.find<IUser>({}).sort({ createdAt: -1 })
    return { users }
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
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {}
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })
    if (!user) throw new Error("User not found")

    return { questions: user.saved }
  } catch (err) {
    console.log(err)
    throw err
  }
}
