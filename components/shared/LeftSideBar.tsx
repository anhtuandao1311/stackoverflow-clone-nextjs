"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "../ui/button"
import { SignedOut } from "@clerk/nextjs"

export default function LeftSideBar() {
  const pathname = usePathname()
  return (
    <section className="background-light900_dark200 light-border sticky left-0 top-0 flex flex-col gap-16 overflow-y-auto border-r px-6 pb-8 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] custom-scrollbar h-screen">
      <div className="flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route
          return (
            <div key={link.route}>
              <Link
                href={link.route}
                className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={link.imgURL}
                  width={20}
                  height={20}
                  alt={link.label}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p
                  className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
                >
                  {link.label}
                </p>
              </Link>
            </div>
          )
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="Login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="text-primary-500 max-lg:hidden">Sign In</span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-dark400_light900">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="Sign Up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  )
}
