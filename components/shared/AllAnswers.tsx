import AnswerVotes from "@/components/shared/AnswerVotes"
import Filter from "@/components/shared/Filter"
import ParsedHTML from "@/components/shared/ParsedHTML"
import { AnswerFilters } from "@/constants/filters"
import { getAnswers } from "@/lib/actions/answer.action"
import { getTimeStamp } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface Props {
  questionId: string
  userId: any
  totalAnswers: number
  page?: number
  filter?: string
}

export default async function AllAnswers({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) {
  const result = await getAnswers({
    questionId: JSON.parse(questionId),
    page: page || 1,
    filter: filter,
  })

  return (
    <div className="mt-11 w-full">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 gap-2 items-center"
              >
                <Image
                  src={answer.author.picture}
                  width={22}
                  height={22}
                  alt="profile"
                  className="rounded-full"
                />
                <div className="flex flex-col sm:flex-row">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}
                  </p>
                  <p className="small-regular text-light400_light500 sm:ml-2 sm:mt-0.5 line-clamp-1">
                    answered {getTimeStamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <AnswerVotes
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasUpvoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasDownvoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParsedHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  )
}
