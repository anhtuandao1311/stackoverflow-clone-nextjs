import LeftSideBar from "@/components/shared/LeftSideBar"
import RightSideBar from "@/components/shared/RightSideBar"
import Navbar from "@/components/shared/navbar/Navbar"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen flex-1 flex-col pt-36 px-6 sm:px-14 pb-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
    </main>
  )
}
