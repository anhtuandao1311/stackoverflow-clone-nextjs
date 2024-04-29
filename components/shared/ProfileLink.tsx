import Image from "next/image"
import Link from "next/link"

interface Props {
  imgUrl: string
  href?: string
  title: string
}

export default function ProfileLink({ imgUrl, href, title }: Props) {
  return (
    <div className="flex-center gap-1.5">
      <Image src={imgUrl} width={20} height={20} alt={title} />
      {href ? (
        <Link
          href={href}
          target="_blank"
          className="text-blue-500 paragraph-medium pt-0.5"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700 pt-0.5">{title}</p>
      )}
    </div>
  )
}
