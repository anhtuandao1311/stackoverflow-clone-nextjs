"use client"

import GlobalResult from "@/components/shared/search/GlobalResult"
import { Input } from "@/components/ui/input"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function GlobalSearch() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [searchKeyword, setSearchKeyword] = useState(query || "")
  const [isOpen, setIsOpen] = useState(false)
  const seachContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        seachContainerRef.current &&
        !seachContainerRef.current?.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    setIsOpen(false)

    document.addEventListener("click", handleOutsideClick)

    return () => document.removeEventListener("click", handleOutsideClick)
  }, [pathname])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchKeyword) {
        const newUrl = formUrlQuery({
          path: pathname,
          params: searchParams.toString(),
          key: "global",
          value: searchKeyword,
        })

        router.push(newUrl, { scroll: false })
      } else {
        const newUrl = removeKeysFromUrlQuery({
          path: pathname,
          params: searchParams.toString(),
          keys: ["global", "type"],
        })

        router.push(newUrl, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchKeyword])

  return (
    <div
      className="relative w-full flex-1 max-w-[600px]"
      ref={seachContainerRef}
    >
      <div className="bg-light-800 dark:bg-dark-300 relative flex min-h-[56px] items-center gap-1 rounded-xl px-4  max-md:hidden">
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
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value)
            if (!isOpen) setIsOpen(true)
            if (e.target.value === "" && isOpen) setIsOpen(false)
          }}
          className="no-focus paragraph-regular placeholder text-dark400_light700 bg-light-800 dark:bg-dark-300 border-none shadow-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  )
}
