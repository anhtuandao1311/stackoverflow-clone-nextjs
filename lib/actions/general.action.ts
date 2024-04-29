"use server"

import Answer from "@/database/answer.model"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { SearchParams } from "@/lib/actions/shared"
import { connectToDatabase } from "@/lib/mongoose"

export async function globalSeach(params: SearchParams) {
  try {
    await connectToDatabase()
    const { global, type } = params
    const regexQuery = { $regex: global, $options: "i" }

    let results = []

    const searchableTypes = ["question", "user", "tag"]

    const modelsAndTypes = [
      {
        model: Question,
        searchField: "title",
        type: "question",
        path: "question",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
        path: "profile",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
        path: "tags",
      },
    ]
    const typeLowerCase = type?.toLowerCase()
    if (!typeLowerCase || !searchableTypes.includes(typeLowerCase)) {
      // search everything
      for (const { model, searchField, type, path } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(5)
        results.push(
          ...queryResults.map((result) => {
            return {
              title: result[searchField],
              id:
                type === "user"
                  ? result.clerkId
                  : JSON.stringify(result._id).slice(1, -1),
              type: type,
              path: path,
            }
          })
        )
      }
    } else {
      // search in the specific type
      const modelInfo = modelsAndTypes.find((m) => m.type === typeLowerCase)
      if (!modelInfo) {
        throw new Error("Invalid type")
      }
      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8)

      results = queryResults.map((result) => {
        return {
          title: result[modelInfo.searchField],
          id:
            type === "user"
              ? result.clerkId
              : JSON.stringify(result._id).slice(1, -1),
          type: type,
          path: modelInfo.path,
        }
      })
    }

    return results
  } catch (error) {
    console.error(error)
    throw error
  }
}
