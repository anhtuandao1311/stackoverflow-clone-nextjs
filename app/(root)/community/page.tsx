import UserCard from "@/components/cards/UserCard"
import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"

export default async function page({ searchParams }: SearchParamsProps) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: 4,
  })
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          placeholder="Search for amazing minds..."
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 grid grid-cols-2 gap-5">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="col-span-2">
            <NoResult
              title="No Users Found"
              description="We couldn't find any users matching your search query. Please try again with a different keyword. 😊"
            />
          </div>
        )}
      </section>
      <div className="mt-10">
        <Pagination
          numberOfPages={result.numberOfPages}
          pageNumber={searchParams?.page ? +searchParams?.page : 1}
        />
      </div>
    </>
  )
}
