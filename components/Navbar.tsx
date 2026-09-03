'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const primaryLinks = [
  { href: '/learn', label: 'Modul Pembelajaran' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/dictionary', label: 'Kamus' },
  { href: '/try', label: 'Coba Gratis' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const desktopLinkClasses = (href: string) => {
    const active = isActive(href)
    if (href === '/try') {
      return active ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-900'
    }
    return active ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-900'
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/learn" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                BelajarBahasaInggris
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${desktopLinkClasses(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/profile')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Profil
              </Link>
            )}
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 mr-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Menu navigasi"
              aria-expanded={mobileOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            {user ? (
              <>
                <span className="text-sm text-gray-500 mr-4 hidden md:block">
                  Selamat datang, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 mr-2"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 hover:bg-primary-50"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200 px-4 pt-2 pb-4 space-y-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${desktopLinkClasses(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/profile')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Profil
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
