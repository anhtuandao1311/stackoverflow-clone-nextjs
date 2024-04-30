import { BADGE_CRITERIA } from "@/constants"
import { BadgeCounts } from "@/types"
import { type ClassValue, clsx } from "clsx"
import queryString from "query-string"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimeStamp(createdAt: Date) {
  const createdDate = new Date(createdAt)
  const currentDate = new Date()
  const timeDifference = currentDate.getTime() - createdDate.getTime()
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const monthsDifference = Math.floor(daysDifference / 30)
  const yearsDifference = Math.floor(monthsDifference / 12)

  if (yearsDifference > 0) {
    return `${yearsDifference} year${yearsDifference === 1 ? "" : "s"} ago`
  } else if (monthsDifference > 0) {
    return `${monthsDifference} month${monthsDifference === 1 ? "" : "s"} ago`
  } else if (daysDifference > 0) {
    return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`
  } else {
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60))
    if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`
    } else {
      const minutesDifference = Math.floor(timeDifference / (1000 * 60))
      return `${minutesDifference} minute${minutesDifference === 1 ? "" : "s"} ago`
    }
  }
}

export function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}

export function formatJoinedDate(date: Date): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `Joined ${month} ${year}`
}

export function formUrlQuery({
  path,
  params,
  key,
  value,
}: {
  path: string
  params: any
  key: string
  value: string | null
}) {
  const currentUrl = queryString.parse(params)
  currentUrl[key] = value
  return queryString.stringifyUrl(
    {
      url: path,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function removeKeysFromUrlQuery({
  path,
  params,
  keys,
}: {
  path: string
  params: any
  keys: string[]
}) {
  const currentUrl = queryString.parse(params)
  for (const key of keys) {
    delete currentUrl[key]
  }
  return queryString.stringifyUrl(
    {
      url: path,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function assignBadges(params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA
    count: number
  }[]
}) {
  const badgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  }

  const criteria = params.criteria
  criteria.forEach((criterion) => {
    const { type, count } = criterion
    const badgeLevels: any = BADGE_CRITERIA[type]
    Object.keys(badgeLevels).forEach((level) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1
      }
    })
  })

  return badgeCounts
}
