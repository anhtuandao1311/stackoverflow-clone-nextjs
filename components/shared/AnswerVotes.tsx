"use client"

import { downvotesAnswer, upvotesAnswer } from "@/lib/actions/answer.action"
import { formatNumber } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

interface Props {
  itemId: string
  userId: string
  upvotes: number
  hasUpvoted: boolean
  downvotes: number
  hasDownvoted: boolean
}

export default function AnswerVotes({
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
}: Props) {
  const pathname = usePathname()

  const handleVote = async (voteType: string) => {
    if (!userId) return toast.error("You need to be logged in to vote")
    if (voteType === "upvote") {
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

      return
    }
    if (voteType === "downvote") {
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
          alt="upvote answer"
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
          alt="downvote answer"
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
    </div>
  )
}
