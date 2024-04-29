import Link from "next/link"
import Metric from "../shared/Metric"
import { formatNumber, getTimeStamp } from "@/lib/utils"
import { SignedIn } from "@clerk/nextjs"
import { IUser } from "@/database/user.model"
import { IQuestion } from "@/database/question.model"
import EditDeleteAction from "@/components/shared/EditDeleteAction"

interface Props {
  clerkId?: string | null
  _id: string
  question: IQuestion
  author: IUser
  upvotes: number[]
  createdAt: Date
}

export default async function AnswerCard({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) {
  const showActionButtons = clerkId && clerkId === author.clerkId

  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-sm">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${question._id}/#${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              <span className="text-primary-500">Reply to: </span>
              {question.title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user avatar"
          value={author.name}
          title={` - answered ${getTimeStamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={formatNumber(upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  )
}
