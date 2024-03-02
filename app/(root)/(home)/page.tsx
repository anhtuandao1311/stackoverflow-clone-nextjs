import Filter from "@/components/shared/Filter"
import HomeFilter from "@/components/home/HomeFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Button } from "@/components/ui/button"
import { HomePageFilters } from "@/constants/filters"
import Link from "next/link"
import NoResult from "@/components/shared/NoResult"
import QuestionCards from "@/components/cards/QuestionCards"

const questions = [
  {
    _id: "1",
    title: "How to use Next.js?",
    tags: [
      { _id: "1", name: "NEXTJS" },
      { _id: "2", name: "REACT" },
    ],
    author: {
      _id: "1", // Assuming an ID for the author
      name: "John Doe",
      picture: "url/to/picture.jpg", // Assuming a URL to the author's picture
    },
    upvotes: 10,
    views: 500651,
    answers: [],
    createdAt: new Date("2023-09-01T00:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div in CSS?. Really need answer right now!",
    tags: [
      { _id: "1", name: "HTML" },
      { _id: "2", name: "CSS" },
    ],
    author: {
      _id: "1", // Assuming an ID for the author
      name: "John Doe",
      picture: "url/to/picture.jpg", // Assuming a URL to the author's picture
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2021-09-01T00:00:00.000Z"),
  },
]

export default function Home() {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="ask-question">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask Question
          </Button>
        </Link>
      </div>

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
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCards
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
            title="There are no questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            linkTo="/ask-question"
            linkDescription="Ask Question"
          />
        )}
      </div>
    </>
  )
}
