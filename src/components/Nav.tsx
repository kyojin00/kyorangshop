'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Nav() {
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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

  return (
    <nav style={{ backgroundColor: 'var(--deep-purple)' }} className="fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">교랑샵</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/80 hover:text-white text-sm">상품</Link>

          {isLoggedIn ? (
            <>
              <Link href="/cart" className="relative text-white/80 hover:text-white text-sm">
                장바구니
                {cartCount > 0 && (
                  <span
                    style={{ backgroundColor: 'var(--warm-purple)' }}
                    className="absolute -top-2 -right-4 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/orders" className="text-white/80 hover:text-white text-sm">주문내역</Link>
            </>
          ) : (
            <Link
              href="/login"
              style={{ backgroundColor: 'var(--warm-purple)' }}
              className="text-white text-sm px-4 py-2 rounded-full"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}