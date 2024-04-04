"use server"

import Interaction from "@/database/interaction.model"
import Question from "@/database/question.model"
import { ViewQuestionParams } from "@/lib/actions/shared"
import { connectToDatabase } from "@/lib/mongoose"

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase()

    const { questionId, userId } = params

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
      })

      if (existingInteraction) return

      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      })
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
