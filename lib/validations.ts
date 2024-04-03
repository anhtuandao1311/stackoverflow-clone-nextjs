import { z } from "zod"

export const questionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20).max(5000),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export type QuestionSchemaType = z.infer<typeof questionSchema>
