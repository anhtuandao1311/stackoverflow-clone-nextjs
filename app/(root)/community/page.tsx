import UserCard from "@/components/cards/UserCard"
import Filter from "@/components/shared/Filter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"

export default async function page() {
  const result = await getAllUsers({})
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

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="w-full flex justify-center items-center">
            <p className="text-dark100_light800">No users found</p>
          </div>
        )}
      </section>
    </>
  )
}
