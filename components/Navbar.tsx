'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

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
            <Link
              href="/learn"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/learn')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Modul Pembelajaran
            </Link>
            <Link
              href="/quiz"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/quiz')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Quiz
            </Link>
            <Link
              href="/dictionary"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dictionary')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Kamus
            </Link>
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
            {user ? (
              <>
                <span className="text-sm text-gray-500 mr-4">
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
    </nav>
  )
}
