'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

interface UserProgress {
  level: string
  lessonsCompleted: number
  totalLessons: number
  xpEarned: number
  dailyStreak: number
  lastLogin: string
}

interface RecentActivity {
  id: number
  type: 'lesson' | 'quiz' | 'word'
  title: string
  completedAt: string
  xpEarned: number
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          // Mock data for demo
          const mockProgress: UserProgress = {
            level: user?.level || 'A1',
            lessonsCompleted: 15,
            totalLessons: 50,
            xpEarned: 1250,
            dailyStreak: 7,
            lastLogin: new Date().toISOString(),
          }

          const mockActivities: RecentActivity[] = [
            { id: 1, type: 'lesson', title: 'Pengenalan Alfabet', completedAt: '2024-01-15T10:30:00', xpEarned: 10 },
            { id: 2, type: 'quiz', title: 'Quiz Alfabet', completedAt: '2024-01-15T11:00:00', xpEarned: 20 },
            { id: 3, type: 'lesson', title: 'Angka 1-20', completedAt: '2024-01-14T09:15:00', xpEarned: 15 },
            { id: 4, type: 'word', title: 'Belajar 10 kata baru', completedAt: '2024-01-14T08:00:00', xpEarned: 5 },
            { id: 5, type: 'quiz', title: 'Quiz Sapaan', completedAt: '2024-01-13T14:30:00', xpEarned: 25 },
          ]

          setProgress(mockProgress)
          setRecentActivities(mockActivities)
          setLoading(false)
        } catch (err) {
          setError('Gagal memuat data profil. Silakan coba lagi.')
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [isAuthenticated, user])

  const getLevelProgress = () => {
    if (!progress) return 0
    return (progress.lessonsCompleted / progress.totalLessons) * 100
  }

  const getNextLevel = () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    const currentIndex = levels.indexOf(progress?.level || 'A1')
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'C2'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (authLoading || loading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return null
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
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-primary-100 text-lg">{user?.email}</p>
                <div className="mt-4 flex gap-4">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    Level: {user?.level}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    XP: {progress?.xpEarned || 0}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    Streak: {progress?.dailyStreak || 0} hari
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Progress Belajar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Level Progress */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Level Saat Ini: {user?.level}
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      Progress Level {user?.level}
                    </span>
                    <span className="text-sm font-medium text-primary-600">
                      {getLevelProgress()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {progress?.lessonsCompleted || 0} dari {progress?.totalLessons || 100} pelajaran selesai
                </p>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Level Selanjutnya: {getNextLevel()}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Terus belajar untuk naik level!
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Statistik
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {progress?.xpEarned || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total XP
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {progress?.dailyStreak || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Streak Hari
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress?.lessonsCompleted || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Pelajaran
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      0
                    </div>
                    <div className="text-sm text-gray-600">
                      Quiz
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Aktivitas Terbaru
            </h2>

            {recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada aktivitas terbaru.
                </p>
                <Link
                  href="/learn"
                  className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Mulai Belajar
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'lesson' ? 'bg-blue-100' :
                            activity.type === 'quiz' ? 'bg-green-100' :
                            'bg-purple-100'
                          }`}>
                            <span className={`text-xl ${
                              activity.type === 'lesson' ? 'text-blue-600' :
                              activity.type === 'quiz' ? 'text-green-600' :
                              'text-purple-600'
                            }`}>
                              {activity.type === 'lesson' ? '📚' :
                               activity.type === 'quiz' ? '📝' : '📖'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(activity.completedAt)} - {formatTime(activity.completedAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            +{activity.xpEarned} XP
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/learn"
                className="card bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-blue-600">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Lanjut Belajar
                </h3>
                <p className="text-gray-600">
                  Lanjutkan pelajaran yang terakhir Anda akses
                </p>
              </Link>
              <Link
                href="/quiz"
                className="card bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-green-600">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Latihan Quiz
                </h3>
                <p className="text-gray-600">
                  Uji pemahaman Anda dengan quiz interaktif
                </p>
              </Link>
              <Link
                href="/dictionary"
                className="card bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-purple-600">📖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Cari Kata
                </h3>
                <p className="text-gray-600">
                  Temukan arti kata dalam kamus kami
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
