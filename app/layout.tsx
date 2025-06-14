import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ventspace',
  description: 'A space for your thoughts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
