import { z } from "zod"

export const questionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(50).max(5000),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export const answerSchema = z.object({
  answer: z.string().min(50).max(5000),
})

export const profileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(30),
  bio: z.string().max(200),
  location: z.string().max(40),
  portfolioWebsite: z.string().max(100),
})

export type QuestionSchemaType = z.infer<typeof questionSchema>

export type AnswerSchemaType = z.infer<typeof answerSchema>

export type ProfileSchemaType = z.infer<typeof profileSchema>
