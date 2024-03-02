import Link from "next/link"
import { Badge } from "../ui/badge"

interface Props {
  _id: string
  name: string
  totalQuestions?: number
  showCount: boolean
}

export default function RenderTag({
  _id,
  name,
  totalQuestions,
  showCount,
}: Props) {
  return (
    <Link href={`/tag/${_id}`} className="flex justify-between gap-2 mb-6">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase shadow-sm">
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  )
}
