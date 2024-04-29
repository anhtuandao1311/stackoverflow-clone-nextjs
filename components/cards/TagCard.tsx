import { ITag } from "@/database/tag.model"
import Link from "next/link"

interface Props {
  tag: ITag
}

export default function TagCard({ tag }: Props) {
  return (
    <Link href={`/tags/${tag._id}`} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-6 py-8">
        <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
          <p className="font-bold text-sm text-dark300_light900">{tag.name}</p>
        </div>
        <p
          className="small-medium text-dark400_light500 mt-3.5
        "
        >
          <span className="body-semibold primary-text-gradient mr-2.5">
            {tag.questions.length}+
          </span>{" "}
          Questions
        </p>
      </article>
    </Link>
  )
}
