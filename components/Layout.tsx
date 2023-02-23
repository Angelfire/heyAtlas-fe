import Head from "next/head"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Atlas - TodoList</title>
        <meta name="description" content="TodoList App for Atlas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mt-11 flex w-full flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </>
  )
}
