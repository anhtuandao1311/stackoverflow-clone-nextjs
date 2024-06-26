/* eslint-disable camelcase */
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import "../styles/prism.css"
import { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/context/ThemeProvider"
import React from "react"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
})

export const metadata: Metadata = {
  title: "HelpMeDevs",
  description:
    "A website built for developers to help each other out using Next.js 14 by Dao Anh Tuan",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
  openGraph: {
    type: "website",
    title: "HelpMeDevs",
    description:
      "A website built for developers to help each other out using Next.js 14 by Dao Anh Tuan",
    images: [
      {
        url: "/assets/images/helpmedevs.jpg",
        width: 1200,
        height: 628,
        alt: "HelpMeDevs",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  )
}
