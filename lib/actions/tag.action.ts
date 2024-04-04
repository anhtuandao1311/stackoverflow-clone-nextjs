"use server"

import Tag, { ITag } from "@/database/tag.model"
import User from "@/database/user.model"
import {
  GetAllTagsParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared"
import { connectToDatabase } from "@/lib/mongoose"

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase()
    const { userId, limit = 3 } = params
    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    // find interactions of user
    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ]
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase()
    // const { page = 1, pageSize = 20, filter, searchQuery } = params
    const tags = await Tag.find<ITag>({}).sort({ createdAt: -1 })
    return { tags }
  } catch (err) {
    console.log(err)
    throw err
  }
}
