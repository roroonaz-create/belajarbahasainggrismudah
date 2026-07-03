import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Belajar Bahasa Inggris Mudah - Kursus Online Gratis',
  description: 'Belajar bahasa Inggris untuk pemula hingga mahir dengan modul terstruktur, quiz interaktif, dan latihan yang menyenangkan.',
  keywords: ['belajar bahasa inggris', 'kursus bahasa inggris', 'bahasa inggris pemula', 'english course', 'learn english'],
  authors: [{ name: 'Belajar Bahasa Inggris Mudah' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://belajarbahasainggrismudah.com',
    siteName: 'Belajar Bahasa Inggris Mudah',
    title: 'Belajar Bahasa Inggris Mudah - Kursus Online Gratis',
    description: 'Belajar bahasa Inggris untuk pemula hingga mahir',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Belajar Bahasa Inggris Mudah',
    description: 'Belajar bahasa Inggris untuk pemula hingga mahir',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
