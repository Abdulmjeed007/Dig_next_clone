import './globals.css'
import type { Metadata } from 'next'
import { Noto_Kufi_Arabic } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers/confetti-provider'
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Noto_Kufi_Arabic({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'كورسات',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
