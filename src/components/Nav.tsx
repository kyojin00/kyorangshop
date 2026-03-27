'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsLoggedIn(true)
      const { count } = await supabase
        .from('shop_carts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setCartCount(count ?? 0)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255,245,247,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(232,98,154,0.12)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="교랑샵"
            width={34}
            height={34}
            className="transition-transform group-hover:scale-105"
          />
          <span
            className="font-display text-xl font-bold"
            style={{ color: 'var(--pink-deep)' }}
          >
            교랑샵
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <Link
                href="/orders"
                className="text-sm px-4 py-2 rounded-full transition-colors hover:bg-pink-50"
                style={{ color: 'var(--text-mid)' }}
              >
                주문내역
              </Link>
              <Link href="/mypage" className="text-sm px-4 py-2 rounded-full transition-colors hover:bg-pink-50" style={{ color: 'var(--text-mid)' }}>
                마이페이지
              </Link>
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-all hover:bg-pink-50"
                style={{ color: 'var(--pink-deep)' }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
                    style={{ backgroundColor: 'var(--pink-main)', fontSize: '10px' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-full transition-colors hover:bg-pink-50"
                style={{ color: 'var(--text-light)' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-5 py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--pink-main)' }}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}