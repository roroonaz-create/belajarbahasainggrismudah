'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

interface Word {
  id: number
  word: string
  pronunciation: string | null
  part_of_speech: string
  definition: string
  example: string | null
  example_translation: string | null
  level_code: string
  category_id: number | null
  is_common: boolean
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

export default function DictionaryPage() {
  const [words, setWords] = useState<Word[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('all')

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

        const mockWords: Word[] = [
          { id: 1, word: 'hello', pronunciation: '/həˈloʊ/', part_of_speech: 'interjection', definition: 'Ucapan sapaan', example: 'Hello, how are you?', example_translation: 'Halo, apa kabar?', level_code: 'A1', category_id: 2, is_common: true },
          { id: 2, word: 'goodbye', pronunciation: '/ɡʊdˈbaɪ/', part_of_speech: 'interjection', definition: 'Ucapan perpisahan', example: 'Goodbye, see you later!', example_translation: 'Selamat tinggal, sampai jumpa!', level_code: 'A1', category_id: 2, is_common: true },
          { id: 3, word: 'thank you', pronunciation: '/θæŋk juː/', part_of_speech: 'interjection', definition: 'Ucapan terima kasih', example: 'Thank you for your help.', example_translation: 'Terima kasih atas bantuanmu.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 4, word: 'please', pronunciation: '/pliːz/', part_of_speech: 'adverb', definition: 'Kata untuk meminta dengan sopan', example: 'Please help me.', example_translation: 'Tolong bantu saya.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 5, word: 'sorry', pronunciation: '/ˈsɔːri/', part_of_speech: 'interjection', definition: 'Ucapan permintaan maaf', example: 'I am sorry for being late.', example_translation: 'Saya minta maaf karena terlambat.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 6, word: 'student', pronunciation: '/ˈstuːdnt/', part_of_speech: 'noun', definition: 'Siswa atau mahasiswa', example: 'I am a student.', example_translation: 'Saya adalah seorang siswa.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 7, word: 'teacher', pronunciation: '/ˈtiːtʃər/', part_of_speech: 'noun', definition: 'Guru', example: 'She is a teacher.', example_translation: 'Dia adalah seorang guru.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 8, word: 'book', pronunciation: '/bʊk/', part_of_speech: 'noun', definition: 'Buku', example: 'I have a book.', example_translation: 'Saya punya sebuah buku.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 9, word: 'pen', pronunciation: '/pɛn/', part_of_speech: 'noun', definition: 'Pulpen', example: 'This is my pen.', example_translation: 'Ini pulpen saya.', level_code: 'A1', category_id: 2, is_common: true },
          { id: 10, word: 'apple', pronunciation: '/ˈæpəl/', part_of_speech: 'noun', definition: 'Apel', example: 'I eat an apple.', example_translation: 'Saya makan sebuah apel.', level_code: 'A1', category_id: 2, is_common: true },
        ]

        setLevels(mockLevels)
        setCategories(mockCategories)
        setWords(mockWords)
        setLoading(false)
      } catch (err) {
        setError('Gagal memuat data kamus. Silakan coba lagi.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Umum'
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Umum'
  }

  const getLevelName = (levelCode: string) => {
    const level = levels.find(l => l.code === levelCode)
    return level ? level.name : levelCode
  }

  const partOfSpeechColors: Record<string, string> = {
    noun: 'blue',
    verb: 'green',
    adjective: 'purple',
    adverb: 'orange',
    preposition: 'red',
    conjunction: 'teal',
    interjection: 'pink',
    pronoun: 'indigo',
    determiner: 'yellow',
  }

  const partOfSpeechTranslations: Record<string, string> = {
    noun: 'Kata Benda',
    verb: 'Kata Kerja',
    adjective: 'Kata Sifat',
    adverb: 'Kata Keterangan',
    preposition: 'Preposisi',
    conjunction: 'Konjungsi',
    interjection: 'Seruan',
    pronoun: 'Kata Ganti',
    determiner: 'Penentu',
  }

  const filteredWords = words.filter(word => {
    // Search filter
    if (searchQuery && !word.word.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !word.definition.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Level filter
    if (selectedLevel !== 'all' && word.level_code !== selectedLevel) {
      return false
    }
    
    // Category filter
    if (selectedCategory !== 'all' && word.category_id?.toString() !== selectedCategory) {
      return false
    }
    
    // Part of speech filter
    if (selectedPartOfSpeech !== 'all' && word.part_of_speech !== selectedPartOfSpeech) {
      return false
    }
    
    return true
  })

  const partOfSpeechOptions = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun', 'determiner']

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
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Kamus Bahasa Inggris
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Temukan arti kata, pengucapan, dan contoh penggunaan
              </p>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari kata... (contoh: hello, thank you, student)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
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
              <div>
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
              <div>
                <label htmlFor="pos-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kata
                </label>
                <select
                  id="pos-filter"
                  value={selectedPartOfSpeech}
                  onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Semua Jenis</option>
                  {partOfSpeechOptions.map((pos) => (
                    <option key={pos} value={pos}>
                      {partOfSpeechTranslations[pos] || pos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedLevel('all')
                    setSelectedCategory('all')
                    setSelectedPartOfSpeech('all')
                  }}
                  className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Hapus Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Words List */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Hasil Pencarian ({filteredWords.length} kata)
              </h2>
            </div>

            {filteredWords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada kata yang sesuai dengan kriteria pencarian.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {filteredWords.map((word) => (
                    <li key={word.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold text-gray-800">{word.word}</h3>
                            {word.is_common && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                Umum
                              </span>
                            )}
                            {word.pronunciation && (
                              <span className="text-gray-500 text-sm">{word.pronunciation}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium bg-${partOfSpeechColors[word.part_of_speech] || 'gray'}-100 text-${partOfSpeechColors[word.part_of_speech] || 'gray'}-800`}>
                              {partOfSpeechTranslations[word.part_of_speech] || word.part_of_speech}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Level {word.level_code}
                            </span>
                            {word.category_id && (
                              <span className={`px-2 py-1 rounded text-xs font-medium bg-${categories.find(c => c.id === word.category_id)?.color || 'gray'}-100 text-${categories.find(c => c.id === word.category_id)?.color || 'gray'}-800`}>
                                {getCategoryName(word.category_id)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{word.definition}</p>
                          {word.example && (
                            <p className="text-gray-500 text-sm mt-1">
                              Contoh: <em>{word.example}</em>
                              {word.example_translation && (
                                <span className="text-gray-400"> ({word.example_translation})</span>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex gap-2">
                          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
                            Simpan
                          </button>
                          <button className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">
                            Pelajari
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ingin belajar lebih sistematis?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Kunjungi modul pembelajaran kami untuk belajar kata-kata ini dalam konteks
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
