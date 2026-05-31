import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manual Payment E-commerce',
  description: 'Vercel + GitHub + Supabase e-commerce starter with manual bKash/Nagad payment approval.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  )
}
