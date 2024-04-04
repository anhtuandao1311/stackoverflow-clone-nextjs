import LeftSideBar from "@/components/shared/LeftSideBar"
import RightSideBar from "@/components/shared/RightSideBar"
import Navbar from "@/components/shared/navbar/Navbar"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex pt-[104px] h-screen">
        <LeftSideBar />
        <section className="flex overflow-y-auto custom-scrollbar flex-1 flex-col pt-10 px-6 max-md:pb-14 sm:px-14 pb-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
    </main>
  )
}
