'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(() => {
        router.push('/')
        router.refresh()
      })
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
      <p className="text-gray-400 text-sm">로그인 처리 중...</p>
    </main>
  )
}