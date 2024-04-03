import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function GlobalSearch() {
  return (
    <div className="bg-light-800 dark:bg-dark-300 relative flex min-h-[56px] flex-1 items-center gap-1 rounded-xl px-4 max-w-[600px] max-md:hidden">
      <Image
        src="/assets/icons/search.svg"
        alt="Search"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder="Search anything globally..."
        className="no-focus paragraph-regular placeholder text-dark400_light700 bg-light-800 dark:bg-dark-300 border-none shadow-none"
      />
    </div>
  )
}
