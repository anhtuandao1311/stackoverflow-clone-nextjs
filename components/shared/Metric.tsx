import Image from "next/image"
import Link from "next/link"

interface Props {
  imgUrl: string
  alt: string
  value: number | string
  title: string
  textStyles?: string
  isAuthor?: boolean
  href?: string
}

export default function Metric({
  alt,
  imgUrl,
  textStyles,
  title,
  value,
  href,
  isAuthor,
}: Props) {
  const MetricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={18}
        height={18}
        className={`${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1 mt-[0.5px]`}>
        {value}

        <span
          className={`small-regular line-clamp-1 mt-[0.5px] ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  )
  if (href) {
    return (
      <Link href={href} className="flex-center flex-wrap gap-1">
        {MetricContent}
      </Link>
    )
  }
  return <div className="flex-center flex-wrap gap-1">{MetricContent}</div>
}
