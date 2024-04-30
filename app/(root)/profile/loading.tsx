import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="w-[140px] h-[140px] rounded-full object-cover" />
          <div className="mt-3">
            <Skeleton className="w-64 h-24" />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h4 className="h3-semibold text-dark200_light900">Stats</h4>
        <div className="mt-5 grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-6">
        <Skeleton className="w-44 h-11" />
        <Skeleton className="h-48 w-full" />
      </div>
    </>
  )
}
