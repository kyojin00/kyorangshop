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
        backgroundColor: scrolled ? 'rgba(253,246,238,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,107,181,0.15)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="교랑샵"
            width={36}
            height={36}
            className="transition-transform group-hover:scale-105"
          />
          <span
            className="font-display text-xl font-bold transition-transform group-hover:scale-105"
            style={{ color: 'var(--deep-purple)' }}
          >
            교랑샵
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/orders"
                className="text-sm px-4 py-2 rounded-full transition-colors hover:bg-purple-50"
                style={{ color: 'var(--soft-brown)' }}
              >
                주문내역
              </Link>
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-all hover:bg-purple-50"
                style={{ color: 'var(--deep-purple)' }}
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    style={{ backgroundColor: 'var(--warm-purple)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-full transition-colors"
                style={{ color: 'var(--soft-brown)' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-5 py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: 'var(--deep-purple)' }}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}