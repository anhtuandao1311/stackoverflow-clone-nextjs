"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionSchemaType, questionSchema } from "@/lib/validations"
import { useRef, useState } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { createQuestion } from "@/lib/actions/question.action"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  mongoUserId: string
}

const type: any = "create"

export default function QuestionForm({ mongoUserId }: Props) {
  const editorRef = useRef(null)
  const form = useForm<QuestionSchemaType>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()
  console.log(pathname)

  async function onSubmit(values: QuestionSchemaType) {
    setIsSubmitting(true)
    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId), // just to be sure
        path: pathname,
      })

      // navigate to homepage
      router.push("/")
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault()
      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()
      if (tagValue != "") {
        if (tagValue.length > 15) {
          form.setError("tags", {
            type: "maxLength",
            message: "Tag should not exceed 15 characters",
          })
        }
        if (!field.value.includes(tagValue.toUpperCase())) {
          form.setValue("tags", [...field.value, tagValue.toUpperCase()])
          tagInput.value = ""
          form.clearErrors("tags")
        }
      }
    }
  }

  const handleRemoveTag = (tag: string, field: any) => {
    if (field.value.includes(tag)) {
      form.setValue(
        "tags",
        field.value.filter((t: string) => t !== tag)
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you are asking a question to another
                person.
              </FormDescription>
              {form.formState.errors.title ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) =>
                    // @ts-ignore
                    (editorRef.current = editor)
                  }
                  initialValue=""
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
                    content_style: "body { font-family:Inter;font-size:16px }",
                  }}
                  onChange={() => {}}
                  onEditorChange={(content) => field.onChange(content)}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem you are experiencing. Minimum 20
                characters.
              </FormDescription>
              {form.formState.errors.explanation ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 cursor-pointer uppercase"
                          onClick={() => handleRemoveTag(tag, field)}
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="Close"
                            width={12}
                            height={12}
                            className="invert-0 dark:invert"
                          ></Image>
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press Enter to add a tag.
              </FormDescription>
              {form.formState.errors.tags ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient text-light-900 mb-10 w-fit self-end"
          disabled={isSubmitting}
        >
          {type === "create" ? "Ask a Question" : "Edit Question"}
        </Button>
      </form>
    </Form>
  )
}
