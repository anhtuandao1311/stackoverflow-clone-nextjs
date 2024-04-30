"use server"

import Question from "@/database/question.model"
import Tag, { ITag } from "@/database/tag.model"
import User from "@/database/user.model"
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared"
import { connectToDatabase } from "@/lib/mongoose"
import { FilterQuery } from "mongoose"

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase()
    const { userId } = params
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
    const { page = 1, pageSize = 6, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize
    const query: FilterQuery<typeof Tag> = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {}

    let sortOptions: any = { createdAt: -1 }
    switch (filter) {
      case "popular":
        break
      case "recent":
        sortOptions = { createdAt: -1 }
        break
      case "name":
        sortOptions = { name: 1 }
        break
      case "old":
        sortOptions = { createdAt: 1 }
        break
      default:
        break
    }

    const tags = await Tag.find<ITag>(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    if (filter === "popular") {
      tags.sort((a, b) => b.questions.length - a.questions.length)
    }
    const totalTags = await Tag.countDocuments(query)
    const numberOfPages = Math.ceil(totalTags / pageSize)
    return { tags, numberOfPages }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function GetQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase()
    const { tagId, page = 1, pageSize = 10, searchQuery } = params
    const tagFilter: FilterQuery<ITag> = { _id: tagId }
    const skipAmount = (page - 1) * pageSize

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: searchQuery, $options: "i" } }
      : {}

    const tag = await Tag.findOne<ITag>(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })

    if (!tag) {
      throw new Error("Tag not found")
    }
    const fullTag = await Tag.findOne(tagFilter)
    const totalQuestions = fullTag.questions.length
    const numberOfPages = Math.ceil(totalQuestions / pageSize)

    return { tagTitle: tag.name, questions: tag.questions, numberOfPages }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getTopTags() {
  try {
    await connectToDatabase()
    const tags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          totalQuestions: { $size: "$questions" },
        },
      },
      { $sort: { totalQuestions: -1 } },
      { $limit: 5 },
    ])
    return tags
  } catch (err) {
    console.log(err)
    throw err
  }
}
