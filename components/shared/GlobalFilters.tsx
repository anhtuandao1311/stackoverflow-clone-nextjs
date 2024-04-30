"use client"

import { GlobalSearchFilters } from "@/constants/filters"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function GlobalFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(searchParams.get("type") || "")
  const handleChangeFilter = (value: string) => {
    setActive(value)
    const newUrl = formUrlQuery({
      path: pathname,
      params: searchParams.toString(),
      key: "type",
      value,
    })
    router.push(newUrl, { scroll: false })
  }

  const handleClearFilters = () => {
    setActive("")
    const newUrl = removeKeysFromUrlQuery({
      path: pathname,
      params: searchParams.toString(),
      keys: ["type"],
    })
    router.push(newUrl, { scroll: false })
  }
  return (
    <div className="flex items-center justify-between px-5">
      <div className="flex items-center gap-5">
        <p className="text-dark400_light900 body-medium">Filters: </p>
        <div className="flex gap-3">
          {GlobalSearchFilters.map((filter) => (
            <button
              key={filter.value}
              className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800  ${active === filter.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:hover:text-primary-500"} `}
              onClick={() => handleChangeFilter(filter.value)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>
      <button
        className="text-dark400_light900 body-medium underline"
        onClick={() => handleClearFilters()}
      >
        Clear Filters
      </button>
    </div>
  )
}
