import Link from "next/link"
import Image from "next/image"
import RenderTag from "./RenderTag"

const questions = [
  { id: "1", title: "How to use React Router?" },
  {
    id: "2",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  { id: "3", title: "Is it only me or the font is bolder than necessary?" },
  { id: "4", title: "Redux Toolkit Not Updating State as Expected" },
  { id: "5", title: "Async/Await Function Not Handling Errors Properly" },
]

const tags = [
  { _id: "1", name: "React", totalQuestions: 100 },
  { _id: "2", name: "NextJS", totalQuestions: 100 },
  { _id: "3", name: "Vue", totalQuestions: 100 },
  { _id: "4", name: "JavaScript", totalQuestions: 100 },
  { _id: "5", name: "HTML", totalQuestions: 100 },
]

export default function RightSideBar() {
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-32 shadow-light-300 dark:shadow-none max-xl:hidden xl:w-[350px] custom-scrollbar">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="flex flex-col items-center mt-7 gap-6">
          {questions.map((question) => (
            <Link
              href={`/questions/${question.id}`}
              className="flex justify-between w-full gap-7 items-center cursor-pointer"
              key={question.id}
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="Right Arrow"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 mb-8">Popular Tags</h3>
        {tags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            totalQuestions={tag.totalQuestions}
            showCount
          />
        ))}
      </div>
    </section>
  )
}
