import { formatNumber } from "@/lib/utils"
import Image from "next/image"

interface StatsProps {
  totalQuestions: number
  totalAnswers: number
  badgeCounts: {
    GOLD: number
    SILVER: number
    BRONZE: number
  }
}

interface StatsCardProps {
  imgUrl: string
  value: number
  title: string
}

function StatsCard({ imgUrl, value, title }: StatsCardProps) {
  return (
    <div className="light-border background-light900_dark300 flex flex-col justify-between gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} width={24} height={24} alt={title} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700 mt-1">{title}</p>
      </div>
    </div>
  )
}

export default function Stats({
  totalQuestions,
  totalAnswers,
  badgeCounts,
}: StatsProps) {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-col justify-between gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700 mt-1">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700 mt-1">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={badgeCounts.GOLD}
          title="Gold Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badgeCounts.SILVER}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badgeCounts.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  )
}
