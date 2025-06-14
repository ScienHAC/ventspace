import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'VentSpace - Your Safe Mental Health Companion',
    template: '%s | VentSpace',
  },
  description: 'VentSpace is a Gen Z mental health platform where you can safely vent, get AI therapy support, and help plant trees.',
  keywords: [
    'mental health',
    'therapy',
    'AI companion',
    'gen z',
    'venting',
    'emotional support',
    'anonymous therapy',
    'mental wellness',
    'tree planting',
    'eco therapy'
  ],
  authors: [{ name: 'VentSpace Team' }],
  creator: 'VentSpace',
  publisher: 'VentSpace',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
