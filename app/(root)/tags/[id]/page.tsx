import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { IQuestion } from "@/database/question.model"
import { GetQuestionsByTagId } from "@/lib/actions/tag.action"
import { URLProps } from "@/types"

export default async function page({ params, searchParams }: URLProps) {
  const result = await GetQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: 3,
  })
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar route="/" placeholder="Search questions in tag..." />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
            />
          ))
        ) : (
          <NoResult
            title="No Questions Found In This Tag"
            description="📚 Maybe try rephrasing your search or ask a new question?"
            linkTo="/ask-question"
            linkDescription="Ask a question"
          />
        )}
      </div>
      {result.questions.length > 0 && (
        <div className="mt-10">
          <Pagination
            numberOfPages={result.numberOfPages}
            pageNumber={searchParams?.page ? +searchParams?.page : 1}
          />
        </div>
      )}
    </>
  )
}
