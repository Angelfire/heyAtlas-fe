import type { AppProps } from "next/app"

import { Toaster } from "@/components/ui/Toaster"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  )
}
