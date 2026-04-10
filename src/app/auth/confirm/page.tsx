'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const hash   = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const access_token  = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          window.location.href = '/login'
          return
        }
        // 서버 세션 쿠키 동기화 후 이동
        router.refresh()
        router.push('/')
      })
    } else {
      // hash 없으면 code 방식 시도 (PKCE)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.refresh()
          router.push('/')
        } else {
          window.location.href = '/login'
        }
      })
    }
  }, [router])

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#fdf6ee',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid #e8e0f3', borderTopColor: '#7c6bb5',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px',
        }} />
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin{to{transform:rotate(360deg)}}' }} />
        <p style={{ color: '#9e8fcb', fontSize: '0.85rem' }}>로그인 처리 중...</p>
      </div>
    </main>
  )
}