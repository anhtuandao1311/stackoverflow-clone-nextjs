"use client"

import { downvotesAnswer, upvotesAnswer } from "@/lib/actions/answer.action"
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

interface Props {
  type: string
  itemId: string
  userId: string
  upvotes: number
  hasUpvoted: boolean
  downvotes: number
  hasDownvoted: boolean
  hasSaved?: boolean
}

export default function Votes({
  type,
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
    if (type === "question") {
      viewQuestion({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      })
    }
  }, [itemId, userId, type])

  const handleVote = async (voteType: string) => {
    if (!userId) return
    if (voteType === "upvote") {
      if (type === "question") {
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
      } else if (type === "answer") {
        try {
          await upvotesAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasDownvoted,
            hasUpvoted,
            path: pathname,
          })
        } catch (err) {
          console.log(err)
        }
      }
      return
    }
    if (voteType === "downvote") {
      if (type === "question") {
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
      } else if (type === "answer") {
        try {
          await downvotesAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasDownvoted,
            hasUpvoted,
            path: pathname,
          })
        } catch (err) {
          console.log(err)
        }
      }
      return
    }
  }

  const handleSaveQuestion = async () => {
    if (!userId) return
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

      {type === "question" && (
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
      )}
    </div>
  )
}
