import { SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import Theme from "./Theme"
import MobileNav from "./MobileNav"
import GlobalSearch from "../search/GlobalSearch"

export default function Navbar() {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12 min-h-[104px]">
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="HelpMeDevs Logo"
          className="mr-1"
        />
        <p className="h2-bold font-spaceGrotesk text-dark100_light900 max-sm:hidden">
          HelpMe
        </p>
        <p className="h2-bold font-spaceGrotesk text-primary-500 max-sm:hidden">
          Devs
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  )
}
