'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Noto Sans KR', sans-serif;
          background: #faf7f4;
        }

        /* 왼쪽 비주얼 패널 */
        .login-left {
          flex: 1;
          background: linear-gradient(145deg, #2a1a5e 0%, #4a2d8f 45%, #7c5cb8 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          top: -120px; right: -120px;
        }

        .login-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,200,100,0.08) 0%, transparent 70%);
          bottom: -80px; left: -60px;
        }

        .left-logo {
          position: relative; z-index: 1;
          margin-bottom: 40px;
        }

        .left-tagline {
          position: relative; z-index: 1;
          text-align: center;
        }

        .left-tagline h2 {
          font-size: 1.6rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .left-tagline p {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.8;
        }

        .left-dots {
          position: absolute; bottom: 40px; z-index: 1;
          display: flex; gap: 6px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.25);
        }
        .dot.active { background: rgba(255,255,255,0.8); width: 20px; border-radius: 3px; }

        /* 오른쪽 폼 */
        .login-right {
          width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          background: #faf7f4;
        }

        .form-logo {
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #1e1340;
          letter-spacing: -0.04em;
          margin-bottom: 6px;
        }

        .form-sub {
          font-size: 0.82rem;
          color: #9e8fcb;
          margin-bottom: 32px;
        }

        .input-wrap {
          width: 100%;
          position: relative;
          margin-bottom: 10px;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e4ddf5;
          border-radius: 14px;
          font-size: 0.88rem;
          font-family: 'Noto Sans KR', sans-serif;
          color: #1e1340;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-input::placeholder { color: #bbb0d8; }
        .login-input:focus {
          border-color: #7c5cb8;
          box-shadow: 0 0 0 3px rgba(124,92,184,0.1);
        }

        .btn-login {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #3a2270 0%, #7c5cb8 100%);
          color: #fff;
          font-size: 0.92rem;
          font-weight: 700;
          font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer;
          margin-top: 6px;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(58,34,112,0.3);
          transition: opacity 0.15s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-login:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .btn-login:disabled {
          background: #c8bfe8;
          box-shadow: none;
          cursor: not-allowed;
        }

        .divider {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .divider-line { flex: 1; height: 1px; background: #e4ddf5; }
        .divider-text { font-size: 0.75rem; color: #bbb0d8; white-space: nowrap; }

        .btn-social {
          width: 100%;
          padding: 13px 16px;
          border-radius: 14px;
          border: 1.5px solid #e4ddf5;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.15s;
          margin-bottom: 10px;
        }

        .btn-kakao {
          background: #FEE500;
          border-color: #FEE500;
          color: #3A1D1D;
          box-shadow: 0 4px 12px rgba(254,229,0,0.3);
        }
        .btn-kakao:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-google {
          background: #fff;
          color: #3d2e6b;
        }
        .btn-google:hover {
          border-color: #7c5cb8;
          background: #faf7ff;
        }

        .error-msg {
          font-size: 0.78rem;
          color: #e05c5c;
          padding: 0 4px;
          margin-bottom: 6px;
          margin-top: -4px;
        }

        /* 모바일 */
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 48px 28px; }
        }
      `}</style>

      <div className="login-root">

        {/* 왼쪽 비주얼 */}
        <div className="login-left">
          <div className="left-logo">
            <Image src="/logo.png" alt="교랑" width={120} height={48} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="left-tagline">
            <h2>교랑과 함께하는<br />특별한 굿즈</h2>
            <p>교랑 캐릭터와 함께하는 소품들을<br />만나보세요.</p>
          </div>
          <div className="left-dots">
            <div className="dot active" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>

        {/* 오른쪽 폼 */}
        <div className="login-right">
          <div className="form-logo">
            <Image src="/logo.png" alt="교랑" width={90} height={36} style={{ objectFit: 'contain' }} />
          </div>

          <p className="form-title">로그인</p>
          <p className="form-sub">계정에 로그인하고 쇼핑을 시작해보세요</p>

          <div style={{ width: '100%' }}>
            <div className="input-wrap">
              <input
                className="login-input"
                type="email"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="input-wrap">
              <input
                className="login-input"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              className="btn-login"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">또는 소셜 계정으로 로그인</span>
              <div className="divider-line" />
            </div>

            <button className="btn-social btn-kakao" onClick={handleKakao}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3A1D1D">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.08 4.03 6.5l-1.03 3.8 4.43-2.9A11.7 11.7 0 0012 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>

            <button className="btn-social btn-google" onClick={handleGoogle}>
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

      </div>
    </>
  )
}