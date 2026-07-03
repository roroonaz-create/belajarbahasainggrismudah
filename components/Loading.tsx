'use client'

import { useState, useEffect } from 'react'

export default function Loading() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-primary-800">
          Belajar Bahasa Inggris Mudah
        </h1>
        <p className="text-primary-600 mt-2">Memuat{dots}</p>
      </div>
    </div>
  )
}
