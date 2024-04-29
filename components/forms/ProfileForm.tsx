"use client"

import { ProfileSchemaType, profileSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { set } from "mongoose"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Editor } from "@tinymce/tinymce-react"
import { Badge } from "lucide-react"
import { type } from "os"
import { updateUser } from "@/lib/actions/user.action"

interface Props {
  clerkId: string
  user: string
}

export default function ProfileForm({ clerkId, user }: Props) {
  const mongoUser = JSON.parse(user)
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: mongoUser.name,
      username: mongoUser.username,
      bio: mongoUser?.bio || "",
      location: mongoUser?.location || "",
      portfolioWebsite: mongoUser?.portfolioWebsite || "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()

  async function onSubmit(values: ProfileSchemaType) {
    setIsSubmitting(true)
    try {
      await updateUser({ clerkId, updateData: values, path: pathname })
      router.push(`/profile/${clerkId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
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
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.name ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.username ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Portfolio Website
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.portfolioWebsite ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.location ? (
                <FormMessage className="text-red-500" />
              ) : (
                <div className="min-h-[20px]"></div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-2">
                Bio
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.bio ? (
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
          Edit Profile
        </Button>
      </form>
    </Form>
  )
}
