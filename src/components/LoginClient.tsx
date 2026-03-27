'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  const handleKakao = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--deep-purple)' }}>교랑샵</h1>
          <p className="text-sm text-gray-400 mt-1">로그인 후 쇼핑하세요 🐱</p>
        </div>

        <div className="space-y-3 mb-6">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ backgroundColor: 'var(--deep-purple)' }}
            className="w-full py-3 rounded-xl text-white font-medium text-sm hover:opacity-90 disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="border-t border-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#FDF6EE] px-3 text-xs text-gray-400">
            또는
          </span>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleKakao}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FEE500', color: '#3A1D1D' }}
          >
            <span>💬</span> 카카오로 로그인
          </button>
          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700"
          >
            <span>🔵</span> 구글로 로그인
          </button>
        </div>
      </div>
    </main>
  )
}