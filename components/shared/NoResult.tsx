import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import { link } from "fs"

interface Props {
  title: string
  description: string
  linkTo?: string
  linkDescription?: string
}

export default function NoResult({
  title,
  description,
  linkTo,
  linkDescription,
}: Props) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-6">
      <Image
        src="/assets/images/light-illustration.png"
        width={300}
        height={300}
        alt="No result"
        className="dark:hidden"
      />

      <Image
        src="/assets/images/dark-illustration.png"
        width={300}
        height={300}
        alt="No result"
        className="hidden dark:block"
      />

      <h2 className="h2-bold text-dark200_light900">{title}</h2>
      <p className="body-regular max-w-[500px] text-dark500_light700 text-center">
        {description}
      </p>
      {linkTo && linkDescription && (
        <Link href={linkTo}>
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900 mb-16">
            {linkDescription}
          </Button>
        </Link>
      )}
    </div>
  )
}
