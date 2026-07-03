'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

interface Lesson {
  id: number
  title: string
  slug: string
  description: string
  content: string
  level_code: string
  category_id: number
  estimated_time_minutes: number
  xp_reward: number
}

interface LessonExample {
  id: number
  example_type: string
  content: string
  translation: string
  audio_url: string | null
  order_index: number
}

interface Category {
  id: number
  name: string
  color: string
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [examples, setExamples] = useState<LessonExample[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    // Fetch lesson data
    const fetchLesson = async () => {
      try {
        // Mock data for demo
        const mockLesson: Lesson = {
          id: 1,
          title: 'Pengenalan Alfabet',
          slug: 'pengenalan-alfabet',
          description: 'Belajar mengenal huruf A-Z dalam bahasa Inggris',
          content: `Alfabet bahasa Inggris terdiri dari 26 huruf. Setiap huruf memiliki nama dan bunyi yang berbeda.

## Huruf Vokal (Vowels)
A, E, I, O, U - dan kadang-kadang Y

## Huruf Konsonan (Consonants)
B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z

## Cara Mengucapkan Alfabet
- A: /eɪ/ (ey)
- B: /biː/ (bee)
- C: /siː/ (see)
- D: /diː/ (dee)
- E: /iː/ (ee)
- F: /ɛf/ (ef)
- G: /dʒiː/ (jee)
- H: /eɪtʃ/ (aitch)
- I: /aɪ/ (eye)
- J: /dʒeɪ/ (jay)
- K: /keɪ/ (kay)
- L: /ɛl/ (el)
- M: /ɛm/ (em)
- N: /ɛn/ (en)
- O: /oʊ/ (oh)
- P: /piː/ (pee)
- Q: /kjuː/ (cue)
- R: /ɑːr/ (ar)
- S: /ɛs/ (ess)
- T: /tiː/ (tee)
- U: /juː/ (you)
- V: /viː/ (vee)
- W: /ˈdʌbəljuː/ (double-you)
- X: /ɛks/ (ex)
- Y: /waɪ/ (why)
- Z: /ziː/ (zee)

## Tips untuk Menghafal Alfabet
1. Latih pengucapan setiap huruf
2. Gunakan lagu alfabet
3. Tulis huruf berulang kali
4. Gunakan flashcard`,
          level_code: params.level as string,
          category_id: 2,
          estimated_time_minutes: 10,
          xp_reward: 10,
        }

        const mockExamples: LessonExample[] = [
          { id: 1, example_type: 'sentence', content: 'A is for Apple', translation: 'A untuk Apel', audio_url: null, order_index: 1 },
          { id: 2, example_type: 'sentence', content: 'B is for Ball', translation: 'B untuk Bola', audio_url: null, order_index: 2 },
          { id: 3, example_type: 'sentence', content: 'C is for Cat', translation: 'C untuk Kucing', audio_url: null, order_index: 3 },
        ]

        const mockCategory: Category = {
          id: 2,
          name: 'Vocabulary',
          color: 'green',
        }

        setLesson(mockLesson)
        setExamples(mockExamples)
        setCategory(mockCategory)
        setLoading(false)
      } catch (err) {
        setError('Gagal memuat pelajaran. Silakan coba lagi.')
        setLoading(false)
      }
    }

    fetchLesson()
  }, [params.level, params.slug])

  const getCategoryColor = () => {
    return category ? category.color : 'gray'
  }

  const renderContent = () => {
    if (!lesson) return null
    
    // Simple markdown rendering
    const lines = lesson.content.split('\n')
    return (
      <div className="prose max-w-none">
        {lines.map((line, index) => {
          if (line.startsWith('# ')) {
            return <h2 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h2>
          }
          if (line.startsWith('## ')) {
            return <h3 key={index} className="text-xl font-semibold mt-4 mb-3">{line.substring(3)}</h3>
          }
          if (line.startsWith('### ')) {
            return <h4 key={index} className="text-lg font-medium mt-3 mb-2">{line.substring(4)}</h4>
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return <li key={index} className="ml-6 my-1">{line.substring(2)}</li>
          }
          if (line.trim() === '') {
            return <p key={index} className="my-2">&nbsp;</p>
          }
          if (line.startsWith('1. ') || line.match(/^\d+\. /)) {
            return <li key={index} className="ml-6 my-1">{line}</li>
          }
          return <p key={index} className="my-2">{line}</p>
        })}
      </div>
    )
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
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600">
            Pelajaran tidak ditemukan
          </h1>
          <Link
            href="/learn"
            className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Kembali ke Daftar Pelajaran
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm">
              <Link href="/learn" className="text-primary-600 hover:text-primary-800">
                Modul Pembelajaran
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-600">Level {lesson.level_code}</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-600">{lesson.title}</span>
            </nav>
          </div>
        </div>

        {/* Lesson Header */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getCategoryColor()}-500 text-white mb-3 inline-block`}>
                    {category?.name || 'Vocabulary'}
                  </span>
                  <h1 className="text-3xl font-bold">{lesson.title}</h1>
                  <p className="text-primary-100 mt-2">{lesson.description}</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{lesson.estimated_time_minutes}</div>
                    <div className="text-sm text-primary-100">menit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">+{lesson.xp_reward}</div>
                    <div className="text-sm text-primary-100">XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'content'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Materi
                  </button>
                  <button
                    onClick={() => setActiveTab('examples')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'examples'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Contoh ({examples.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'quiz'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Latihan
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'content' && (
                  <div className="prose max-w-none">
                    {renderContent()}
                  </div>
                )}

                {activeTab === 'examples' && (
                  <div className="space-y-4">
                    {examples.length === 0 ? (
                      <p className="text-gray-500">Tidak ada contoh untuk pelajaran ini.</p>
                    ) : (
                      examples.map((example) => (
                        <div
                          key={example.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex flex-col md:flex-row md:gap-4">
                            <div className="flex-1">
                              <p className="font-medium">{example.content}</p>
                            </div>
                            {example.translation && (
                              <div className="flex-1 mt-2 md:mt-0">
                                <p className="text-gray-600">{example.translation}</p>
                              </div>
                            )}
                          </div>
                          {example.audio_url && (
                            <div className="mt-2">
                              <audio controls src={example.audio_url} className="w-full" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-4">
                      Latihan untuk Pelajaran ini
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Uji pemahaman Anda dengan quiz interaktif
                    </p>
                    <Link
                      href={`/quiz?lesson=${lesson.id}`}
                      className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Mulai Quiz
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <Link
                href="/learn"
                className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Kembali ke Daftar Pelajaran
              </Link>
              <Link
                href={`/quiz?lesson=${lesson.id}`}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Latihan Quiz
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
