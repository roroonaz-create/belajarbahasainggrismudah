'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

interface Quiz {
  id: number
  title: string
  description: string
  level_code: string
  category_id: number
  total_questions: number
  passing_score: number
  xp_reward: number
}

interface Category {
  id: number
  name: string
  color: string
}

interface Level {
  code: string
  name: string
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        // Mock data for demo
        const mockLevels: Level[] = [
          { code: 'A1', name: 'Pemula' },
          { code: 'A2', name: 'Dasar' },
          { code: 'B1', name: 'Menengah' },
          { code: 'B2', name: 'Menengah Atas' },
          { code: 'C1', name: 'Lancar' },
          { code: 'C2', name: 'Mahir' },
        ]

        const mockCategories: Category[] = [
          { id: 1, name: 'Grammar', color: 'blue' },
          { id: 2, name: 'Vocabulary', color: 'green' },
          { id: 3, name: 'Listening', color: 'purple' },
          { id: 4, name: 'Speaking', color: 'orange' },
          { id: 5, name: 'Reading', color: 'red' },
          { id: 6, name: 'Writing', color: 'teal' },
        ]

        const mockQuizzes: Quiz[] = [
          { id: 1, title: 'Quiz Alfabet', description: 'Test pengetahuan tentang alfabet Inggris', level_code: 'A1', category_id: 2, total_questions: 5, passing_score: 70, xp_reward: 20 },
          { id: 2, title: 'Quiz Angka', description: 'Test pengetahuan tentang angka', level_code: 'A1', category_id: 2, total_questions: 5, passing_score: 70, xp_reward: 20 },
          { id: 3, title: 'Quiz Sapaan', description: 'Test sapaan dasar', level_code: 'A1', category_id: 1, total_questions: 5, passing_score: 70, xp_reward: 25 },
          { id: 4, title: 'Quiz Grammar A1', description: 'Test grammar tingkat A1', level_code: 'A1', category_id: 1, total_questions: 10, passing_score: 70, xp_reward: 30 },
          { id: 5, title: 'Quiz Vocabulary A2', description: 'Test kosa kata tingkat A2', level_code: 'A2', category_id: 2, total_questions: 10, passing_score: 70, xp_reward: 35 },
          { id: 6, title: 'Quiz Listening B1', description: 'Test listening tingkat B1', level_code: 'B1', category_id: 3, total_questions: 8, passing_score: 70, xp_reward: 40 },
        ]

        setLevels(mockLevels)
        setCategories(mockCategories)
        setQuizzes(mockQuizzes)
        setLoading(false)
      } catch (err) {
        setError('Gagal memuat data quiz. Silakan coba lagi.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Umum'
  }

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.color : 'gray'
  }

  const getLevelName = (levelCode: string) => {
    const level = levels.find(l => l.code === levelCode)
    return level ? level.name : levelCode
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    if (selectedLevel !== 'all' && quiz.level_code !== selectedLevel) {
      return false
    }
    if (selectedCategory !== 'all' && quiz.category_id.toString() !== selectedCategory) {
      return false
    }
    return true
  })

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
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Latihan Quiz
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Uji pemahaman Anda dengan quiz interaktif
              </p>
              <Link
                href="#quizzes"
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Lihat Semua Quiz
              </Link>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  id="level-filter"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Semua Level</option>
                  {levels.map((level) => (
                    <option key={level.code} value={level.code}>
                      Level {level.code} - {level.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Quizzes Grid */}
        <section id="quizzes" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Daftar Quiz
            </h2>

            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada quiz yang sesuai dengan filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedLevel('all')
                    setSelectedCategory('all')
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Hapus Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}`}
                    className="card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-${getCategoryColor(quiz.category_id)}-100 text-${getCategoryColor(quiz.category_id)}-800`}>
                          {getCategoryName(quiz.category_id)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Level {quiz.level_code}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {quiz.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {quiz.total_questions} Soal
                        </span>
                        <span className="text-sm text-primary-600 font-medium">
                          +{quiz.xp_reward} XP
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          Passing Score: {quiz.passing_score}%
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ingin belajar terlebih dahulu?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Kunjungi modul pembelajaran kami untuk mempersiapkan diri
            </p>
            <Link
              href="/learn"
              className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Kunjungi Modul Pembelajaran
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
