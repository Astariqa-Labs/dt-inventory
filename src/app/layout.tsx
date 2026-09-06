import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DT Shop | Clarks Thrift & Suede Renewal',
  description: 'Authentic Clarks thrift and custom suede restoration.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900">
        < Navbar/>
        {children}
      </body>
    </html>
  )
}