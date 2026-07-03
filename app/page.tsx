'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/Loading'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect ke halaman learn
    router.push('/learn')
  }, [router])

  return <Loading />
}
