'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Question {
  question: string
  options: string[]
  correctIndex: number
}

interface QuizData {
  id: number
  title: string
  description: string
  level_code: string
  passing_score: number
  xp_reward: number
  questions: Question[]
}

const quizzes: QuizData[] = [
  {
    id: 1,
    title: 'Quiz Alfabet',
    description: 'Test pengetahuan tentang alfabet Inggris',
    level_code: 'A1',
    passing_score: 70,
    xp_reward: 20,
    questions: [
      { question: 'Huruf pertama dalam alfabet Inggris adalah...', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
      { question: 'Berapa jumlah huruf dalam alfabet Inggris?', options: ['24', '25', '26', '27'], correctIndex: 2 },
      { question: 'Yang termasuk huruf vokal adalah...', options: ['A, E, I, O, U', 'A, B, C, D', 'G, H, I, J', 'B, C, D, F'], correctIndex: 0 },
      { question: 'Huruf apa yang mengikuti "H" dalam alfabet?', options: ['G', 'I', 'J', 'K'], correctIndex: 1 },
      { question: 'Huruf "Z" dalam bahasa Inggris Amerika dibaca...', options: ['/zed/', '/zoo/', '/ziː/', '/za/'], correctIndex: 2 },
    ],
  },
  {
    id: 2,
    title: 'Quiz Angka',
    description: 'Test pengetahuan tentang angka',
    level_code: 'A1',
    passing_score: 70,
    xp_reward: 20,
    questions: [
      { question: '"One" berarti angka...', options: ['1', '2', '3', '4'], correctIndex: 0 },
      { question: 'Berapa hasil "five" ditambah "two"?', options: ['6', '7', '8', '9'], correctIndex: 1 },
      { question: '"Ten" dalam bahasa Indonesia adalah...', options: ['Lima', 'Dua', 'Sepuluh', 'Seratus'], correctIndex: 2 },
      { question: 'Angka 12 dalam bahasa Inggris adalah...', options: ['Twelv', 'Twenteen', 'Twelen', 'Twelve'], correctIndex: 3 },
      { question: 'Angka 20 dalam bahasa Inggris adalah...', options: ['Teen', 'Twenty', 'Tweenty', 'Twoten'], correctIndex: 1 },
    ],
  },
  {
    id: 3,
    title: 'Quiz Sapaan',
    description: 'Test sapaan dasar',
    level_code: 'A1',
    passing_score: 70,
    xp_reward: 25,
    questions: [
      { question: 'Ucapan sapaan di pagi hari adalah...', options: ['Good morning', 'Good night', 'Goodbye', 'Sorry'], correctIndex: 0 },
      { question: 'Balasan yang tepat untuk "How are you?" adalah...', options: ['Goodbye', 'I am fine, thank you', 'See you', 'Thank you'], correctIndex: 1 },
      { question: 'Ucapan yang tepat saat pertama kali bertemu adalah...', options: ['Good night', 'Excuse me', 'Nice to meet you', 'Can I help you?'], correctIndex: 2 },
      { question: '"Selamat tinggal" dalam bahasa Inggris adalah...', options: ['Hello', 'Goodbye', 'Good morning', 'Please'], correctIndex: 1 },
      { question: 'Ucapan terima kasih dalam bahasa Inggris adalah...', options: ['Thank you', 'You are welcome', 'Sorry', 'Hello'], correctIndex: 0 },
    ],
  },
  {
    id: 4,
    title: 'Quiz Grammar A1',
    description: 'Test grammar tingkat A1',
    level_code: 'A1',
    passing_score: 70,
    xp_reward: 30,
    questions: [
      { question: 'Kalimat yang benar adalah...', options: ['She are a teacher', 'She is a teacher', 'She am a teacher', 'She be a teacher'], correctIndex: 1 },
      { question: 'Kata ganti orang pertama tunggal ("saya") adalah...', options: ['You', 'He', 'I', 'We'], correctIndex: 2 },
      { question: 'Bentuk jamak dari "book" adalah...', options: ['Bookes', 'Bookies', 'Book', 'Books'], correctIndex: 3 },
      { question: '"They ___ students." Kata yang tepat adalah...', options: ['is', 'am', 'are', 'be'], correctIndex: 2 },
      { question: 'Kata tanya untuk menanyakan tempat adalah...', options: ['Who', 'When', 'What', 'Where'], correctIndex: 3 },
    ],
  },
  {
    id: 5,
    title: 'Quiz Vocabulary A2',
    description: 'Test kosa kata tingkat A2',
    level_code: 'A2',
    passing_score: 70,
    xp_reward: 35,
    questions: [
      { question: 'Sinonim dari "big" adalah...', options: ['small', 'large', 'tiny', 'short'], correctIndex: 1 },
      { question: 'Lawan kata dari "hot" adalah...', options: ['cold', 'warm', 'boiling', 'humid'], correctIndex: 0 },
      { question: '"Delicious" berarti...', options: ['Mahal', 'Cepat', 'Lezat', 'Indah'], correctIndex: 2 },
      { question: 'Lawan kata dari "cheap" adalah...', options: ['free', 'expensive', 'affordable', 'low'], correctIndex: 1 },
      { question: '"Beautiful" berarti...', options: ['Indah', 'Besar', 'Kuat', 'Tinggi'], correctIndex: 0 },
    ],
  },
  {
    id: 6,
    title: 'Quiz Listening B1',
    description: 'Test listening tingkat B1',
    level_code: 'B1',
    passing_score: 70,
    xp_reward: 40,
    questions: [
      { question: 'Dengarkan: "Could you open the window, please?" Yang diminta adalah...', options: ['Menutup jendela', 'Membuka jendela', 'Membuka pintu', 'Menyalakan lampu'], correctIndex: 1 },
      { question: 'Dengarkan: "I have been living here since 2019." Dia tinggal di sini sejak...', options: ['2020', '2021', '2018', '2019'], correctIndex: 3 },
      { question: 'Dengarkan: "Could you tell me where the station is?" Yang dia tanyakan adalah...', options: ['Jadwal kereta', 'Harga tiket', 'Lokasi stasiun', 'Waktu buka'], correctIndex: 2 },
      { question: 'Dengarkan: "I would like to book a table for two at seven." Dia sedang...', options: ['Memesan tiket kereta', 'Memesan meja restoran', 'Memesan hotel', 'Memesan taksi'], correctIndex: 1 },
      { question: 'Dengarkan: "Let us meet at the cinema at six o\'clock." Mereka bertemu pada pukul...', options: ['5', '6', '7', '8'], correctIndex: 1 },
    ],
  },
]

export default function QuizDetailPage() {
  const params = useParams()
  const quiz = quizzes.find((q) => q.id === Number(params.id)) || null

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    Array(quiz ? quiz.questions.length : 0).fill(null)
  )
  const [submitted, setSubmitted] = useState(false)

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600">Quiz tidak ditemukan</h1>
            <Link
              href="/quiz"
              className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Kembali ke Daftar Quiz
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const total = quiz.questions.length
  const question = quiz.questions[current]
  const answered = answers[current] !== null

  const correctCount = quiz.questions.reduce(
    (count, q, i) => count + (answers[i] === q.correctIndex ? 1 : 0),
    0
  )
  const percentage = Math.round((correctCount / total) * 100)
  const passed = percentage >= quiz.passing_score

  const selectOption = (index: number) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = index
      return next
    })
  }

  const next = () => {
    if (current < total - 1) {
      setCurrent(current + 1)
    } else {
      setSubmitted(true)
    }
  }

  const restart = () => {
    setAnswers(Array(total).fill(null))
    setCurrent(0)
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6">
            <Link href="/quiz" className="text-primary-600 hover:text-primary-800">
              Quiz
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{quiz.title}</span>
          </nav>

          {submitted ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {passed ? '🏆' : '📝'}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {passed ? 'Selamat, Anda Lulus!' : 'Belum Lulus'}
              </h1>
              <p className="text-gray-600 mb-6">
                Skor Anda: <strong>{correctCount}</strong> dari {total} benar ({percentage}%)
              </p>
              <p className="text-gray-500 mb-2">
                Passing score: {quiz.passing_score}%
              </p>
              <p className={`font-semibold mb-8 ${passed ? 'text-green-600' : 'text-gray-500'}`}>
                {passed
                  ? `+${quiz.xp_reward} XP berhasil didapatkan`
                  : 'Jangan menyerah, coba lagi ya!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={restart}
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ulangi Quiz
                </button>
                <Link
                  href="/quiz"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kembali ke Daftar Quiz
                </Link>
                <Link
                  href="/learn"
                  className="px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Lanjut Belajar
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Level {quiz.level_code} • {total} soal • Passing score {quiz.passing_score}%
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  Soal {current + 1} dari {total}
                </span>
              </div>

              {/* Progress */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${((current + 1) / total) * 100}%` }}
                ></div>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {question.question}
              </h2>

              <div className="space-y-3 mb-8">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectOption(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      answers[current] === index
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrent(Math.max(0, current - 1))}
                  disabled={current === 0}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={next}
                  disabled={!answered}
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {current < total - 1 ? 'Selanjutnya' : 'Selesai'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
