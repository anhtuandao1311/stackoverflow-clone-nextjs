import Link from "next/link"
import Image from "next/image"
import RenderTag from "./RenderTag"
import { getTopQuestions } from "@/lib/actions/question.action"
import { getTopTags } from "@/lib/actions/tag.action"

export default async function RightSideBar() {
  const topQuestions = await getTopQuestions()
  const topTags = await getTopTags()
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden xl:w-[350px] custom-scrollbar h-screen">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="flex flex-col items-center mt-7 gap-6">
          {topQuestions.map((question) => (
            <Link
              href={`/question/${question.id}`}
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
        <div className="flex flex-col mb-6 gap-6">
          {topTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  )
}
