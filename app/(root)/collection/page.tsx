import Filter from "@/components/shared/Filter"
import HomeFilter from "@/components/home/HomeFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { HomePageFilters } from "@/constants/filters"
import NoResult from "@/components/shared/NoResult"
import QuestionCard from "@/components/cards/QuestionCard"
import { getSavedQuestions } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Home() {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const result = await getSavedQuestions({
    clerkId: userId,
  })
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar route="/" placeholder="Search questions..." />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:block"
        />
      </div>
      <HomeFilter />

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
            title="There are no saved questions to show"
            description="📚 It appears that your saved questions library is currently empty. Fear not! You have the power to change that. 🚀

            Be the trailblazer — ask thought-provoking questions, save them, and contribute to the collective wisdom. Who knows? Your query might ignite a spark of knowledge that illuminates the path for others. 💡"
            linkTo="/ask-question"
            linkDescription="Ask Question"
          />
        )}
      </div>
    </>
  )
}
