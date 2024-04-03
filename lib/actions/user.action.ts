"use server"

import User, { IUser } from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "@/lib/actions/shared"
import { revalidatePath } from "next/cache"
import console from "console"
import Question from "@/database/question.model"

export async function getUserById(params: any) {
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

    const userQuestionIds = await Question.find({
      author: deletedUser._id,
    }).distinct("_id")

    await Question.deleteMany({ author: deletedUser._id })

    return deletedUser
  } catch (err) {
    console.log(err)
    throw err
  }
}
