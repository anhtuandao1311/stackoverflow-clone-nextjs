"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

interface ThemeContextInterface {
  mode: string
  setMode: Dispatch<SetStateAction<string>>
}

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("")
  const handleThemeChange = () => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark")
      setMode("dark")
    } else {
      document.documentElement.classList.remove("dark")
      setMode("light")
    }
  }

  useEffect(() => {
    handleThemeChange()
  }, [mode])
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
