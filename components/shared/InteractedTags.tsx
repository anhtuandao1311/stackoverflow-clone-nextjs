import RenderTag from "@/components/shared/RenderTag"
import { ITag } from "@/database/tag.model"

interface Props {
  tags: ITag[]
}

export default function InteractedTags({ tags }: Props) {
  return (
    <div className="mt-10 max-w-full">
      <h4 className="h3-semibold text-dark200_light900">Tags</h4>
      <div className="mt-5 flex flex-wrap gap-3">
        {tags &&
          tags.length > 0 &&
          tags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          ))}
        {tags && tags.length === 0 && (
          <div className="text-dark400_light700 body-medium">
            It seems like this user has not interacted with any tags yet.
          </div>
        )}
      </div>
    </div>
  )
}
