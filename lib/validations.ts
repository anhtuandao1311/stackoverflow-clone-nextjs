import { z } from "zod"

export const questionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(50).max(5000),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export const answerSchema = z.object({
  answer: z.string().min(50).max(5000),
})

export type QuestionSchemaType = z.infer<typeof questionSchema>

export type AnswerSchemaType = z.infer<typeof answerSchema>
