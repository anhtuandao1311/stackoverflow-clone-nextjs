import Image from "next/image"
import { Input } from "../../ui/input"

export default function LocalSearchBar({
  route,
  placeholder,
}: {
  placeholder: string
  route: string
}) {
  return (
    <div className="bg-light-800 dark:bg-dark-300 relative flex min-h-[56px] flex-1 items-center gap-1 rounded-xl px-4">
      <Image
        src="/assets/icons/search.svg"
        alt="Search"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        className="no-focus bg-light-800 dark:bg-dark-300 paragraph-regular placeholder text-dark400_light700 border-none shadow-none "
      />
    </div>
  )
}
