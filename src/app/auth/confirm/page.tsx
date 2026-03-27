'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  useEffect(() => {
    const supabase = createClient()

    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(() => {
        window.location.href = 'https://shop.kyorang.com'
      })
    } else {
      window.location.href = 'https://shop.kyorang.com/login'
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
      <p className="text-gray-400 text-sm">로그인 처리 중...</p>
    </main>
  )
}