interface Props {
  children: React.ReactNode
}

export default function layout({ children }: Props) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      {children}
    </main>
  )
}
