"use client"
import { Button } from "@/components/ui/button"
import { HomePageFilters } from "@/constants/filters"
import { formUrlQuery } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function HomeFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState(searchParams.get("filter") || "newest")

  const handleChangeFilter = (value: string) => {
    let newUrl = ""
    setActive((prev) => {
      newUrl = formUrlQuery({
        path: pathname,
        params: searchParams.toString(),
        key: "filter",
        value: value,
      })
      router.push(newUrl, { scroll: false })
      return value
    })
  }
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none dark:bg-dark-300 ${active === filter.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500 "}`}
          onClick={() => handleChangeFilter(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  )
}
