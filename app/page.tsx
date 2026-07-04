'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/Loading'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect ke halaman try (coba) untuk pengunjung baru
    router.push('/try')
  }, [router])

  return <Loading />
}
