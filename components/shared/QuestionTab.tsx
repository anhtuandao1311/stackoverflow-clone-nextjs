import QuestionCard from "@/components/cards/QuestionCard"
import { getUserQuestions } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"

interface Props extends SearchParamsProps {
  userId: string
  clerkId?: string
}

export default async function QuestionTab({
  searchParams,
  userId,
  clerkId,
}: Props) {
  const result = await getUserQuestions({ userId, page: 1 })
  return (
    <div className="flex flex-col gap-6 mt-6">
      {result.questions.length > 0 &&
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
            clerkId={clerkId}
          />
        ))}

      {result.questions.length === 0 && (
        <p className="text-dark400_light700 body-medium text-center">
          This user has not asked any questions yet.
        </p>
      )}
    </div>
  )
}
