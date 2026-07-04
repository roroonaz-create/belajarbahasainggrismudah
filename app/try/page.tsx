'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface SampleLesson {
  id: number
  title: string
  slug: string
  description: string
  level: string
  category: string
}

interface SampleWord {
  word: string
  pronunciation: string
  definition: string
  example: string
}

interface SampleQuiz {
  title: string
  description: string
  questions: number
}

export default function TryPage() {
  const sampleLessons: SampleLesson[] = [
    { id: 1, title: 'Pengenalan Alfabet', slug: 'pengenalan-alfabet', description: 'Belajar mengenal huruf A-Z dalam bahasa Inggris', level: 'A1', category: 'Vocabulary' },
    { id: 2, title: 'Angka 1-20', slug: 'angka-1-20', description: 'Belajar angka dari 1 sampai 20', level: 'A1', category: 'Vocabulary' },
    { id: 3, title: 'Sapaan Dasar', slug: 'sapaan-dasar', description: 'Belajar ucapan sapaan dasar', level: 'A1', category: 'Grammar' },
  ]

  const sampleWords: SampleWord[] = [
    { word: 'hello', pronunciation: '/həˈloʊ/', definition: 'Ucapan sapaan', example: 'Hello, how are you?' },
    { word: 'thank you', pronunciation: '/θæŋk juː/', definition: 'Ucapan terima kasih', example: 'Thank you for your help.' },
    { word: 'student', pronunciation: '/ˈstuːdnt/', definition: 'Siswa atau mahasiswa', example: 'I am a student.' },
    { word: 'teacher', pronunciation: '/ˈtiːtʃər/', definition: 'Guru', example: 'She is a teacher.' },
    { word: 'book', pronunciation: '/bʊk/', definition: 'Buku', example: 'I have a book.' },
  ]

  const sampleQuizzes: SampleQuiz[] = [
    { title: 'Quiz Alfabet', description: 'Test pengetahuan tentang alfabet Inggris', questions: 5 },
    { title: 'Quiz Angka', description: 'Test pengetahuan tentang angka', questions: 5 },
    { title: 'Quiz Sapaan', description: 'Test sapaan dasar', questions: 5 },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Coba Belajar Bahasa Inggris
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Lihat preview konten kami sebelum mendaftar
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Daftar Sekarang
                </Link>
                <Link
                  href="/learn"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
                >
                  Lihat Semua Konten
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Apa yang Bisa Anda Coba?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sample Lessons */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-blue-600">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                  Sample Pelajaran
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Coba beberapa pelajaran dasar kami
                </p>
                <div className="space-y-3">
                  {sampleLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/learn/${lesson.level}/${lesson.slug}`}
                      className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{lesson.title}</div>
                      <div className="text-sm text-gray-600">{lesson.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Level {lesson.level} - {lesson.category}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/learn"
                  className="block mt-4 text-center text-primary-600 hover:text-primary-800 font-medium"
                >
                  Lihat semua pelajaran →
                </Link>
              </div>

              {/* Sample Words */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-green-600">📖</span>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                  Sample Kamus
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Temukan arti kata-kata dasar
                </p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {sampleWords.map((word, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-md"
                    >
                      <div className="font-medium text-gray-800">{word.word}</div>
                      <div className="text-sm text-gray-500">{word.pronunciation}</div>
                      <div className="text-sm text-gray-600">{word.definition}</div>
                      <div className="text-xs text-gray-400 italic">
                        Contoh: {word.example}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/dictionary"
                  className="block mt-4 text-center text-primary-600 hover:text-primary-800 font-medium"
                >
                  Lihat semua kata →
                </Link>
              </div>

              {/* Sample Quizzes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-purple-600">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                  Sample Quiz
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Coba quiz interaktif kami
                </p>
                <div className="space-y-3">
                  {sampleQuizzes.map((quiz, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-md"
                    >
                      <div className="font-medium text-gray-800">{quiz.title}</div>
                      <div className="text-sm text-gray-600">{quiz.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {quiz.questions} soal
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/quiz"
                  className="block mt-4 text-center text-primary-600 hover:text-primary-800 font-medium"
                >
                  Lihat semua quiz →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Mengapa Bergabung?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-blue-600">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Modul Terstruktur
                </h3>
                <p className="text-gray-600">
                  Pelajaran dari pemula hingga mahir dengan kurikulum yang terorganisir
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-green-600">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pantau Progress
                </h3>
                <p className="text-gray-600">
                  Lihat perkembangan belajar Anda dan dapatkan sertifikat
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-purple-600">🏆</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sistem Reward
                </h3>
                <p className="text-gray-600">
                  Dapatkan XP, naik level, dan raih prestasi belajar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Siap untuk Belajar Serius?
            </h2>
            <p className="text-xl mb-8">
              Daftar sekarang untuk mendapatkan akses penuh ke semua fitur
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
