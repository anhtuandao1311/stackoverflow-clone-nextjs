"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useTheme } from "@/context/ThemeProvider"
import { createAnswer } from "@/lib/actions/answer.action"
import { AnswerSchemaType, answerSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
  question: string
  questionId: string
  authorId: string
}

export default function AnswerForm({ question, questionId, authorId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { mode } = useTheme()
  const editorRef = useRef<any>(null)
  const form = useForm<AnswerSchemaType>({
    defaultValues: {
      answer: "",
    },
    resolver: zodResolver(answerSchema),
  })
  const pathname = usePathname()
  // const router = useRouter()
  // const [isSubmittingAI, setIsSubmittingAI] = useState(false)

  const handleCreateAnswer = async (data: AnswerSchemaType) => {
    setIsSubmitting(true)
    try {
      await createAnswer({
        content: data.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      })

      toast.success("Answer submitted successfully")

      form.reset()
      if (editorRef.current) {
        editorRef.current.setContent("")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleGenerateAIAnswer = async () => {
  //   if (!authorId) return

  //   setIsSubmittingAI(true)

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify({ question }),
  //       }
  //     )

  //     const answer = await response.json()
  //     console.log(answer)
  //     const formattedAnswer = answer.reply.replace(/\n/g, "<br />")

  //     if (editorRef.current) {
  //       editorRef.current.setContent(formattedAnswer)
  //     }

  //     // toats
  //   } catch (err) {
  //     console.log(err)
  //   } finally {
  //     setIsSubmittingAI(false)
  //   }
  // }

  return (
    <div className="w-full mt-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        {/* <Button
          className="btn light-border-2 gap-1.5 rounded px-4 py-2.5 text-primary-500 shadow-none"
          onClick={() => handleGenerateAIAnswer()}
          disabled={isSubmittingAI}
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          ></Image>
          {isSubmittingAI ? "Generating..." : "Generate AI answer"}
        </Button> */}
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-8"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          noValidate
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) =>
                      // @ts-ignore
                      (editorRef.current = editor)
                    }
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo |" +
                        "codesample bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify |  bullist numlist",
                      content_style:
                        "body { font-family:Inter;font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "",
                    }}
                    onChange={() => {}}
                    // {...field}
                    onEditorChange={(content) => field.onChange(content)}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Give them a hand by providing a solution. Minimum 50
                  characters.
                </FormDescription>
                {form.formState.errors.answer ? (
                  <FormMessage className="text-red-500" />
                ) : (
                  <div className="min-h-[20px]"></div>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              className="primary-gradient text-white"
              disabled={isSubmitting}
              onClick={() => {
                if (!authorId)
                  return toast.error("You need to be logged in to answer")
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
