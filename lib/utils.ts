import { type ClassValue, clsx } from "clsx"
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
