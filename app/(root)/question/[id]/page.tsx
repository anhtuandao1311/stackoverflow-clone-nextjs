import AnswerForm from "@/components/forms/AnswerForm"
import AllAnswers from "@/components/shared/AllAnswers"
import Metric from "@/components/shared/Metric"
import ParsedHTML from "@/components/shared/ParsedHTML"
import RenderTag from "@/components/shared/RenderTag"
import Votes from "@/components/shared/Votes"
import { IUser } from "@/database/user.model"
import { getQuestionById } from "@/lib/actions/question.action"
import { getUserById } from "@/lib/actions/user.action"
import { formatNumber, getTimeStamp } from "@/lib/utils"
import { URLProps } from "@/types"
import { auth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default async function page({ params, searchParams }: URLProps) {
  const question = await getQuestionById({ questionId: params.id })
  const { userId } = auth()
  let mongoUser: IUser | null = null
  if (userId) {
    mongoUser = await getUserById({ userId: userId })
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center gap-1"
          >
            <Image
              src={question.author.picture}
              alt="User"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={question.upvotes.length}
              hasUpvoted={question.upvotes.includes(mongoUser?._id)}
              downvotes={question.downvotes.length}
              hasDownvoted={question.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
        <div className="mb-8 mt-5 flex flex-wrap gap-4 w-full">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={` Asked ${getTimeStamp(question.createdAt)}`}
            title=""
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatNumber(question.answers.length)}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={formatNumber(question.views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>

        <ParsedHTML data={question.content} />
        <div className="mt-16 flex gap-3 w-full mb-6">
          <p className="text-dark200_light900 h3-semibold mt-0.5">Tags:</p>
          {question.tags.map((tag: { _id: string; name: string }) => (
            <RenderTag
              key={tag._id}
              name={tag.name}
              _id={tag._id}
              showCount={false}
            />
          ))}
        </div>

        <AllAnswers
          questionId={JSON.stringify(question._id)}
          userId={JSON.stringify(mongoUser?._id || {})}
          totalAnswers={question.answers.length}
          filter={searchParams?.filter}
          page={Number(searchParams?.page)}
        />

        <AnswerForm
          question={question.content}
          questionId={JSON.stringify(question._id)}
          authorId={JSON.stringify(mongoUser?._id)}
        />
      </div>
    </>
  )
}
