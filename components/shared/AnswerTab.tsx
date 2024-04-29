import AnswerCard from "@/components/cards/AnswerCard"
import { getUserAnswers } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"

interface Props extends SearchParamsProps {
  userId: string
  clerkId?: string
}

export default async function AnswerTab({
  searchParams,
  userId,
  clerkId,
}: Props) {
  const result = await getUserAnswers({
    userId,
    page: 1,
  })
  return (
    <div className="flex flex-col gap-6 mt-6">
      {result.answers.length > 0 &&
        result.answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            clerkId={clerkId}
            question={answer.question}
            author={answer.author}
            upvotes={answer.upvotes}
            createdAt={answer.createdAt}
          />
        ))}
      {result.answers.length === 0 && (
        <p className="text-dark400_light700 body-medium text-center">
          This user has not answered any questions yet.
        </p>
      )}
    </div>
  )
}
