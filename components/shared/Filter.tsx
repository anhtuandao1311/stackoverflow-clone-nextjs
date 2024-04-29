"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select"
import { formUrlQuery } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface Props {
  filters: {
    name: string
    value: string
  }[]
  otherClasses?: string
  containerClasses?: string
}

export default function Filter({
  filters,
  otherClasses,
  containerClasses,
}: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const filter = searchParams.get("filter") || ""
  const handleChangeFilter = (value: string) => {
    const newUrl = formUrlQuery({
      path: pathname,
      params: searchParams.toString(),
      key: "filter",
      value,
    })
    router.push(newUrl, { scroll: false })
  }
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        defaultValue={filter}
        onValueChange={(value) => handleChangeFilter(value)}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-3`}
        >
          <SelectValue placeholder="Select a Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="text-dark400_light900 background-light900_dark200"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
