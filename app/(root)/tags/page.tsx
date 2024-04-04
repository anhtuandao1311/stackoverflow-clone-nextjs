import TagCard from "@/components/cards/TagCard"
import Filter from "@/components/shared/Filter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { UserFilters } from "@/constants/filters"
import { getAllTags } from "@/lib/actions/tag.action"

export default async function page() {
  const result = await getAllTags({})
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar route="/tags" placeholder="Search for tags..." />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <div className="w-full flex justify-center items-center">
            <p className="text-dark100_light800">No tags found</p>
          </div>
        )}
      </section>
    </>
  )
}
