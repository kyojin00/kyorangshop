'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
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
      options: { redirectTo: 'https://shop.kyorang.com/auth/confirm' },
    })
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://shop.kyorang.com/auth/confirm' },
    })
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#fdf6ee',
      fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 24px' }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: '16px', marginBottom: '14px',
            background: 'linear-gradient(135deg, #3d2e6b, #7c6bb5)',
            boxShadow: '0 8px 24px rgba(61,46,107,0.25)',
          }}>
            <span style={{ fontSize: '1.6rem' }}>🐱</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#3d2e6b', letterSpacing: '-0.03em' }}>
            교랑
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#9e8fcb' }}>
            로그인하고 시작해보세요
          </p>
        </div>

        {/* 이메일/비번 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', border: '1.5px solid #e8e0f3',
              borderRadius: '14px', padding: '13px 16px',
              fontSize: '0.9rem', outline: 'none', background: '#fff',
              color: '#3d2e6b', boxSizing: 'border-box',
              fontFamily: 'inherit', transition: 'border-color 0.2s',
            }}
            onFocus={e  => { e.target.style.borderColor = '#7c6bb5'; }}
            onBlur={e   => { e.target.style.borderColor = '#e8e0f3'; }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', border: '1.5px solid #e8e0f3',
              borderRadius: '14px', padding: '13px 16px',
              fontSize: '0.9rem', outline: 'none', background: '#fff',
              color: '#3d2e6b', boxSizing: 'border-box',
              fontFamily: 'inherit', transition: 'border-color 0.2s',
            }}
            onFocus={e  => { e.target.style.borderColor = '#7c6bb5'; }}
            onBlur={e   => { e.target.style.borderColor = '#e8e0f3'; }}
          />

          {error && (
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#e05c5c', padding: '0 4px' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '14px', border: 'none',
              background: loading || !email || !password
                ? '#c5b8e8'
                : 'linear-gradient(135deg, #3d2e6b, #7c6bb5)',
              color: '#fff', fontSize: '0.92rem', fontWeight: 700,
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              boxShadow: loading || !email || !password
                ? 'none'
                : '0 6px 20px rgba(61,46,107,0.3)',
              transition: 'all 0.2s', fontFamily: 'inherit',
              letterSpacing: '-0.01em',
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        {/* 구분선 */}
        <div style={{ position: 'relative', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #e8e0f3', position: 'absolute', top: '50%', left: 0, right: 0 }} />
          <span style={{
            position: 'relative', background: '#fdf6ee',
            padding: '0 12px', fontSize: '0.75rem', color: '#b8a9d9',
          }}>또는</span>
        </div>

        {/* 소셜 로그인 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleKakao}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '14px', border: 'none',
              background: '#FEE500', color: '#3A1D1D',
              fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px', fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(254,229,0,0.4)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            카카오로 로그인
          </button>

          <button
            onClick={handleGoogle}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '14px', border: '1.5px solid #e8e0f3',
              background: '#fff', color: '#3d2e6b',
              fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px', fontFamily: 'inherit',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#7c6bb5'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8e0f3'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            구글로 로그인
          </button>
        </div>

      </div>
    </main>
  )
}