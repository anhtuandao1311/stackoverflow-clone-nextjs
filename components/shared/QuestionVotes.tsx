"use client"

import { viewQuestion } from "@/lib/actions/interaction.action"
import {
  downvotesQuestion,
  upvotesQuestion,
} from "@/lib/actions/question.action"
import { ToggleSaveQuestion } from "@/lib/actions/user.action"
import { formatNumber } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

interface Props {
  itemId: string
  userId: string
  upvotes: number
  hasUpvoted: boolean
  downvotes: number
  hasDownvoted: boolean
  hasSaved?: boolean
}

export default function QuestionVotes({
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: Props) {
  const pathname = usePathname()
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    })
  }, [itemId, userId])

  const handleVote = async (voteType: string) => {
    if (!userId) return toast.error("You need to be logged in to vote")
    if (voteType === "upvote") {
      try {
        await upvotesQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasDownvoted,
          hasUpvoted,
          path: pathname,
        })
      } catch (err) {
        console.log(err)
      }
      return
    }
    if (voteType === "downvote") {
      try {
        await downvotesQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasDownvoted,
          hasUpvoted,
          path: pathname,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleSaveQuestion = async () => {
    if (!userId)
      return toast.error("You need to be logged in to save a question")
    try {
      await ToggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathname,
      })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="flex-center gap-3">
      <div className="flex-center gap-1.5">
        <Image
          src={
            hasUpvoted
              ? "/assets/icons/upvoted.svg"
              : "/assets/icons/upvote.svg"
          }
          alt="upvote"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            hasDownvoted
              ? "/assets/icons/downvoted.svg"
              : "/assets/icons/downvote.svg"
          }
          alt="downvote"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleSaveQuestion()}
        />
      </div>
    </div>
  )
}
