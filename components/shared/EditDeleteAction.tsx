"use client"

import { deleteAnswer } from "@/lib/actions/answer.action"
import { deleteQuestion } from "@/lib/actions/question.action"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  type: string
  itemId: string
}

export default function EditDeleteAction({ type, itemId }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`)
  }
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname })
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname })
    }
  }
  return (
    <div className="flex-shrink-0 flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit icon"
          width={16}
          height={16}
          className="cursor-pointer object-contain"
          onClick={() => handleEdit()}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="delete icon"
        width={16}
        height={16}
        className="cursor-pointer object-contain"
        onClick={() => handleDelete()}
      />
    </div>
  )
}
