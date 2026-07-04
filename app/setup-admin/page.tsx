'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSetupAdmin = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/setup-admin')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal setup admin')
      }

      setMessage(data.message)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600 mb-4">
            Setup Admin
          </h1>
          <p className="text-gray-600 mb-6">
            Buat akun admin default untuk aplikasi
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-4">
              {message}
            </div>
          )}

          <button
            onClick={handleSetupAdmin}
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Memproses...' : 'Setup Admin'}
          </button>

          <p className="text-sm text-gray-500">
            Setelah setup, Anda akan diarahkan ke halaman login.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Email: admin@belajarbahasainggris.com<br />
            Password: @@Asdf1290##
          </p>

          <div className="mt-6">
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-800 text-sm"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
