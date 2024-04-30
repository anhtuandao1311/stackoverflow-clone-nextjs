import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <section>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Skeleton className="w-32 h-6" />
          <div className="flex justify-end gap-3">
            <Skeleton className="w-8 h-6" />
            <Skeleton className="w-8 h-6" />
            <Skeleton className="w-8 h-6" />
          </div>
        </div>
        <div className="mt-3.5 w-full">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="mb-8 mt-5 flex flex-wrap gap-4 w-full">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-20 h-5" />
        </div>

        <Skeleton className="w-full h-60" />
      </div>
    </section>
  )
}
