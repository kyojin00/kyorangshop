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
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('이메일 또는 비밀번호가 올바르지 않아요'); setLoading(false); return }
    router.push('/'); router.refresh()
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

        .login-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Noto Sans KR', sans-serif;
          background: #fff5f7;
          position: relative;
          overflow: hidden;
        }

        /* 상단 물결 배경 */
        .login-hero {
          width: 100%;
          background: linear-gradient(160deg, #f9a8c0 0%, #f472a0 40%, #e8569a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 52px 24px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-blob1 {
          position: absolute;
          width: 280px; height: 280px; border-radius: 50%;
          background: rgba(255,255,255,0.12);
          top: -60px; right: -40px;
        }
        .hero-blob2 {
          position: absolute;
          width: 180px; height: 180px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          bottom: 20px; left: -30px;
        }

        .hero-logo {
          position: relative; z-index: 1;
          margin-bottom: 20px;
          filter: brightness(0) invert(1);
        }

        .hero-title {
          position: relative; z-index: 1;
          font-size: 1rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        /* 물결 SVG */
        .wave {
          width: 100%;
          margin-top: -2px;
          display: block;
        }

        /* 폼 카드 */
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 36px 28px 40px;
          margin-top: -20px;
          position: relative; z-index: 2;
        }

        .card-heading {
          font-size: 1.25rem;
          font-weight: 900;
          color: #2d1a2e;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .card-sub {
          font-size: 0.8rem;
          color: #c48aaa;
          margin-bottom: 28px;
        }

        .login-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #f5d0dc;
          border-radius: 14px;
          font-size: 0.88rem;
          font-family: 'Noto Sans KR', sans-serif;
          color: #2d1a2e;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 10px;
          display: block;
        }
        .login-input::placeholder { color: #e0b4c4; }
        .login-input:focus {
          border-color: #f472a0;
          box-shadow: 0 0 0 3px rgba(244,114,160,0.12);
        }

        .btn-login {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #f472a0 0%, #e8569a 100%);
          color: #fff;
          font-size: 0.92rem;
          font-weight: 700;
          font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer;
          margin-top: 4px;
          margin-bottom: 22px;
          box-shadow: 0 8px 20px rgba(232,86,154,0.35);
          transition: opacity 0.15s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-login:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-login:disabled { background: #f5c2d6; box-shadow: none; cursor: not-allowed; }

        .divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .divider-line { flex: 1; height: 1px; background: #f5d0dc; }
        .divider-text { font-size: 0.73rem; color: #e0aabe; white-space: nowrap; }

        .btn-social {
          width: 100%;
          padding: 13px 16px;
          border-radius: 14px;
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
          border: 1.5px solid transparent;
        }
        .btn-kakao {
          background: #FEE500;
          color: #3A1D1D;
          box-shadow: 0 4px 12px rgba(254,229,0,0.3);
        }
        .btn-kakao:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-google {
          background: #fff;
          color: #2d1a2e;
          border-color: #f5d0dc;
        }
        .btn-google:hover { border-color: #f472a0; background: #fff8fa; }

        .error-msg {
          font-size: 0.78rem; color: #e05c7c;
          padding: 0 4px; margin-bottom: 8px; margin-top: -4px;
        }

        @media (max-width: 480px) {
          .login-card { padding: 28px 20px 36px; }
        }
      `}</style>

      <div className="login-wrap">

        {/* 상단 히어로 */}
        <div className="login-hero">
          <div className="hero-blob1" />
          <div className="hero-blob2" />
          <Image
            src="/logo.png"
            alt="교랑"
            width={110}
            height={44}
            className="hero-logo"
            style={{ objectFit: 'contain' }}
            priority
          />
          <p className="hero-title">교랑이 캐릭터 공식 소품샵</p>
        </div>

        {/* 물결 */}
        <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 50 }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#e8569a" opacity="0.15"/>
          <path d="M0,40 C400,10 1040,60 1440,30 L1440,0 L0,0 Z" fill="#fff5f7"/>
        </svg>

        {/* 폼 */}
        <div className="login-card">
          <p className="card-heading">로그인</p>
          <p className="card-sub">교랑샵에 오신 걸 환영해요</p>

          <input
            className="login-input"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

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
            <span className="divider-text">또는 소셜 계정으로</span>
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
    </>
  )
}