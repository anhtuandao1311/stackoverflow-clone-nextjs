import TagCard from "@/components/cards/TagCard"
import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { TagFilters } from "@/constants/filters"
import { getAllTags } from "@/lib/actions/tag.action"
import { SearchParamsProps } from "@/types"

export default async function page({ searchParams }: SearchParamsProps) {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: 6,
  })
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar route="/tags" placeholder="Search for tags..." />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-5">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <div className="col-span-2 md:col-span-3">
            <NoResult
              title="Tag Not Found"
              description="But fear not, you're just a question away from creating a spark in this category! 💡"
              linkTo="/ask-question"
              linkDescription="Ask Question"
            />
          </div>
        )}
      </section>
      {result.tags.length > 0 && (
        <div className="mt-10">
          <Pagination
            numberOfPages={result.numberOfPages}
            pageNumber={searchParams?.page ? +searchParams?.page : 1}
          />
        </div>
      )}
    </>
  )
}
