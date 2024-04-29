"use client"
import Image from "next/image"
import { Input } from "../../ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils"

export default function LocalSearchBar({
  route,
  placeholder,
}: {
  placeholder: string
  route: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [searchKeyword, setSearchKeyword] = useState(query || "")

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchKeyword) {
        const newUrl = formUrlQuery({
          path: pathname,
          params: searchParams.toString(),
          key: "q",
          value: searchKeyword,
        })

        router.push(newUrl, { scroll: false })
      } else {
        const newUrl = removeKeysFromUrlQuery({
          path: pathname,
          params: searchParams.toString(),
          keys: ["q"],
        })

        router.push(newUrl, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchKeyword])

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
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
    </div>
  )
}
