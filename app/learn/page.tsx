'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

interface Level {
  code: string
  name: string
  description: string
  lessonCount: number
}

interface Lesson {
  id: number
  title: string
  slug: string
  description: string
  level_code: string
  category_id: number
  estimated_time_minutes: number
  xp_reward: number
}

interface Category {
  id: number
  name: string
  color: string
  icon: string
}

export default function LearnPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string>('A1')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        // For demo, we'll use mock data
        // In production, replace with actual API calls
        const mockLevels: Level[] = [
          { code: 'A1', name: 'Pemula', description: 'Tingkat dasar untuk pemula', lessonCount: 10 },
          { code: 'A2', name: 'Dasar', description: 'Tingkat dasar yang sudah mengerti kalimat sederhana', lessonCount: 15 },
          { code: 'B1', name: 'Menengah', description: 'Tingkat menengah yang sudah bisa berkomunikasi sederhana', lessonCount: 20 },
          { code: 'B2', name: 'Menengah Atas', description: 'Tingkat menengah atas yang sudah lancar', lessonCount: 25 },
          { code: 'C1', name: 'Lancar', description: 'Tingkat lanjut yang sudah bisa berkomunikasi dengan lancar', lessonCount: 15 },
          { code: 'C2', name: 'Mahir', description: 'Tingkat mahir yang hampir seperti penutur asli', lessonCount: 10 },
        ]

        const mockCategories: Category[] = [
          { id: 1, name: 'Grammar', color: 'blue', icon: 'grammar' },
          { id: 2, name: 'Vocabulary', color: 'green', icon: 'vocabulary' },
          { id: 3, name: 'Listening', color: 'purple', icon: 'listening' },
          { id: 4, name: 'Speaking', color: 'orange', icon: 'speaking' },
          { id: 5, name: 'Reading', color: 'red', icon: 'reading' },
          { id: 6, name: 'Writing', color: 'teal', icon: 'writing' },
          { id: 7, name: 'Pronunciation', color: 'pink', icon: 'pronunciation' },
        ]

        const mockLessons: Lesson[] = [
          { id: 1, title: 'Pengenalan Alfabet', slug: 'pengenalan-alfabet', description: 'Belajar mengenal huruf A-Z', level_code: 'A1', category_id: 2, estimated_time_minutes: 10, xp_reward: 10 },
          { id: 2, title: 'Angka 1-20', slug: 'angka-1-20', description: 'Belajar angka dari 1 sampai 20', level_code: 'A1', category_id: 2, estimated_time_minutes: 15, xp_reward: 15 },
          { id: 3, title: 'Sapaan Dasar', slug: 'sapaan-dasar', description: 'Belajar ucapan sapaan dasar', level_code: 'A1', category_id: 1, estimated_time_minutes: 20, xp_reward: 20 },
          { id: 4, title: 'Pronouns (Kata Ganti)', slug: 'pronouns-kata-ganti', description: 'Belajar kata ganti orang', level_code: 'A1', category_id: 1, estimated_time_minutes: 25, xp_reward: 25 },
          { id: 5, title: 'Verb To Be', slug: 'verb-to-be', description: 'Belajar penggunaan to be', level_code: 'A1', category_id: 1, estimated_time_minutes: 30, xp_reward: 30 },
        ]

        setLevels(mockLevels)
        setCategories(mockCategories)
        setLessons(mockLessons.filter(l => l.level_code === selectedLevel))
        setLoading(false)
      } catch (err) {
        setError('Gagal memuat data. Silakan coba lagi.')
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedLevel])

  const handleLevelChange = (levelCode: string) => {
    setSelectedLevel(levelCode)
    // Filter lessons by selected level
    // In production: fetchLessons(levelCode)
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Umum'
  }

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.color : 'gray'
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">{error}</h1>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Belajar Bahasa Inggris
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Mulai dari pemula hingga mahir dengan modul terstruktur
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#levels"
                  className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Pilih Level
                </Link>
                <Link
                  href="/quiz"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Latihan Quiz
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Level Selection */}
        <section id="levels" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Pilih Level Anda
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levels.map((level) => (
                <button
                  key={level.code}
                  onClick={() => handleLevelChange(level.code)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedLevel === level.code
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary-600">
                      {level.code}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mt-1">
                      {level.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {level.lessonCount} Pelajaran
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lessons Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Pelajaran Level {selectedLevel}
              </h2>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <span
                    key={category.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      `bg-${category.color}-100 text-${category.color}-800`
                    }`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada pelajaran untuk level ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${lesson.level_code}/${lesson.slug}`}
                    className="card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-${getCategoryColor(lesson.category_id)}-100 text-${getCategoryColor(lesson.category_id)}-800`}>
                          {getCategoryName(lesson.category_id)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {lesson.estimated_time_minutes} menit
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {lesson.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary-600 font-medium">
                          +{lesson.xp_reward} XP
                        </span>
                        <span className="text-sm text-gray-500">
                          Level {lesson.level_code}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Siap untuk belajar lebih banyak?
            </h2>
            <p className="text-xl mb-8">
              Daftar sekarang untuk menyimpan progress belajar Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Daftar Gratis
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
