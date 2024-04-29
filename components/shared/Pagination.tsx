"use client"

import { Button } from "@/components/ui/button"
import { formUrlQuery } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface Props {
  pageNumber: number
  numberOfPages: number
}

const RANGE = 2

export default function Pagination({ numberOfPages, pageNumber }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const page = pageNumber
  const newPrevUrl = formUrlQuery({
    path: pathname,
    params: searchParams.toString(),
    key: "page",
    value: (pageNumber - 1).toString(),
  })

  const newNextUrl = formUrlQuery({
    path: pathname,
    params: searchParams.toString(),
    key: "page",
    value: (pageNumber + 1).toString(),
  })
  const renderPagination = () => {
    let dotBefore = false
    let dotAfter = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <div
            key={index}
            className="flex-center rounded-md bg-primary-500 px-3.5 py-2
        "
          >
            <p className="body-semibold text-light-900">...</p>
          </div>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <div
            key={index}
            className="flex-center rounded-md bg-primary-500 px-3.5 py-2
        "
          >
            <p className="body-semibold text-light-900">...</p>
          </div>
        )
      }
      return null
    }

    return Array(numberOfPages)
      .fill(0)
      .map((_, index) => {
        const currentPage = index + 1
        if (
          page <= RANGE * 2 + 1 &&
          currentPage > page + RANGE &&
          currentPage < numberOfPages - RANGE + 1
        ) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < numberOfPages - RANGE * 2) {
          if (currentPage < page - RANGE && currentPage > RANGE) {
            return renderDotBefore(index)
          } else if (
            currentPage > page + RANGE &&
            currentPage < numberOfPages - RANGE + 1
          ) {
            return renderDotAfter(index)
          }
        } else if (
          page >= numberOfPages - RANGE * 2 &&
          currentPage > RANGE &&
          currentPage < page - RANGE
        ) {
          return renderDotBefore(index)
        }

        const isActive = currentPage === page

        const currentPageUrl = formUrlQuery({
          path: pathname,
          params: searchParams.toString(),
          key: "page",
          value: currentPage.toString(),
        })
        return (
          <Link href={currentPageUrl} key={index} className="mx-1">
            <div
              className={`flex-center rounded-md px-3.5 py-2 ${isActive ? "bg-primary-500" : "background-light800_dark300"}`}
            >
              <p
                className={`${isActive ? "text-light-900 body-semibold" : "text-dark500_light700 body-medium"}`}
              >
                {currentPage}
              </p>
            </div>
          </Link>
        )
      })
  }

  return (
    <div className="flex-center flex-wrap mt-6">
      {page === 1 ? (
        <Button
          className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2 mr-3 cursor-not-allowed"
          disabled
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      ) : (
        <Link href={newPrevUrl}>
          <Button className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2 mr-3">
            <p className="body-medium text-dark200_light800">Prev</p>
          </Button>
        </Link>
      )}
      {renderPagination()}
      {page === numberOfPages ? (
        <Button
          className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2 ml-3 cursor-pointer"
          disabled
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      ) : (
        <Link href={newNextUrl}>
          <Button className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2 ml-3">
            <p className="body-medium text-dark200_light800">Next</p>
          </Button>
        </Link>
      )}
    </div>
  )
}
