"use server"

import Question from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import { CreateQuestionParams, GetQuestionsParams } from "./shared"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"

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
    return { questions }
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
