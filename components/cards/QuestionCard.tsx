import Link from "next/link"
import RenderTag from "../shared/RenderTag"
import Metric from "../shared/Metric"
import { formatNumber, getTimeStamp } from "@/lib/utils"
import { ITag } from "@/database/tag.model"
import { IUser } from "@/database/user.model"
import EditDeleteAction from "@/components/shared/EditDeleteAction"
import { SignedIn } from "@clerk/nextjs"

interface Props {
  id: string
  title: string
  tags: ITag[]
  author: IUser
  upvotes: Object[]
  views: number
  answers: Object[]
  createdAt: Date
  clerkId?: string | null
}

export default function QuestionCard({
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  clerkId,
}: Props) {
  const showActionButtons = clerkId && clerkId === author.clerkId
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-sm shadow">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2 mb-10">
        {tags.map((tag) => (
          <RenderTag
            key={tag._id}
            name={tag.name}
            _id={tag._id}
            showCount={false}
          />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author.clerkId}`}
          isAuthor
        />
        <div className="flex justify-between gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatNumber(upvotes.length)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Answers"
            value={formatNumber(answers.length)}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={formatNumber(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  )
}
