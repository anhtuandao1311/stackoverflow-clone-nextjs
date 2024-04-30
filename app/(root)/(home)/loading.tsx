import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function loading() {
  return (
    <section>
      <div className="flex justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-14 flex-1" />
        <div className="hidden max-md:block">
          <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
        </div>
      </div>

      <div className="mt-10 hidden md:flex md:flex-wrap gap-3 ">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-9 w-28" />
          ))}
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
      </div>
    </section>
  )
}
