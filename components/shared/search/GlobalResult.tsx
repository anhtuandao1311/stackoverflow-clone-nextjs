"use client"

import { useEffect, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import GlobalFilters from "@/components/shared/GlobalFilters"
import { globalSeach } from "@/lib/actions/general.action"

export default function GlobalResult() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<any>([])
  const global = searchParams.get("global")
  const type = searchParams.get("type")

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true)
        const res = await globalSeach({ global, type })
        setResult(res)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (global) {
      fetchResult()
    }
  }, [global, type])
  const renderItemLink = (path: string, id: string) => `/${path}/${id}`
  return (
    <div className="absolute w-full mt-3 z-10 bg-light-800 py-5 shadow-sm dark:bg-dark-300 rounded-xl max-h-[500px] overflow-y-auto custom-scrollbar">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center flex-col">
            <ReloadIcon className="my-2 w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  key={item.type + item.id + index}
                  href={renderItemLink(item.path, item.id)}
                  className="flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50 "
                >
                  <Image
                    src={`/assets/icons/${item.type}.svg`}
                    alt="tag"
                    width={20}
                    height={20}
                    className="invert-colors mb-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-5xl">🫣</p>
                <p className="text-dark200_light800 body_regular px-5 py-2.5">
                  No Results Found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
