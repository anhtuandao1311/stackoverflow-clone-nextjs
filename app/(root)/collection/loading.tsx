import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <section>
      <div className="flex justify-between">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-14 flex-1" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
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
