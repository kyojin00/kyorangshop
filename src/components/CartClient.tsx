'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface CartItem {
  id: string
  quantity: number
  product: any
}

export default function CartClient({ cartItems: initial }: { cartItems: CartItem[] }) {
  const [items, setItems] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity < 1) return
    setLoadingId(cartId)
    await supabase.from('shop_carts').update({ quantity }).eq('id', cartId)
    setItems(prev => prev.map(i => i.id === cartId ? { ...i, quantity } : i))
    setLoadingId(null)
  }

  const removeItem = async (cartId: string) => {
    setLoadingId(cartId)
    await supabase.from('shop_carts').delete().eq('id', cartId)
    setItems(prev => prev.filter(i => i.id !== cartId))
    setLoadingId(null)
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  if (items.length === 0) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="mb-6">
            <Image src="/logo.png" alt="교랑" width={80} height={80} className="mx-auto opacity-30" />
          </div>
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-mid)' }}>장바구니가 비었어요</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-light)' }}>마음에 드는 상품을 담아보세요</p>
          <button
            onClick={() => router.push('/')}
            className="text-white px-7 py-3 rounded-full font-medium transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--pink-main), var(--pink-deep))',
              boxShadow: '0 4px 16px rgba(232,98,154,0.35)',
            }}
          >
            쇼핑하러 가기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* 상단 핑크 바 */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FFB6D3, #E8629A, #C97BB2)' }} />

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>장바구니</h1>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
          >
            {items.length}개 상품
          </span>
        </div>

        {/* 상품 목록 */}
        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 flex gap-4 items-center transition-opacity"
              style={{
                boxShadow: '0 2px 12px rgba(232,98,154,0.07)',
                opacity: loadingId === item.id ? 0.5 : 1,
              }}
            >
              {/* 이미지 */}
              <div
                className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                style={{ backgroundColor: 'var(--peach)' }}
              >
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image src="/logo.png" alt="교랑" width={36} height={36} className="opacity-30" />
                  </div>
                )}
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug truncate" style={{ color: 'var(--text-dark)' }}>
                  {item.product.name}
                </p>
                <p className="font-bold mt-1" style={{ color: 'var(--pink-deep)' }}>
                  {(item.product.price * item.quantity).toLocaleString()}원
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                  개당 {item.product.price.toLocaleString()}원
                </p>
              </div>

              {/* 수량 + 삭제 */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs transition-colors hover:opacity-60"
                  style={{ color: 'var(--text-light)' }}
                >
                  ✕
                </button>
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{ border: '1.5px solid var(--pink-light)' }}
                >
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors hover:bg-pink-50"
                    style={{ color: 'var(--pink-deep)' }}
                  >
                    -
                  </button>
                  <span
                    className="w-8 text-center text-sm font-bold"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors hover:bg-pink-50"
                    style={{ color: 'var(--pink-deep)' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div
          className="bg-white rounded-3xl p-6"
          style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.08)' }}
        >
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-dark)' }}>주문 요약</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-light)' }}>상품 금액</span>
              <span style={{ color: 'var(--text-mid)' }}>{total.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-light)' }}>배송비</span>
              <span style={{ color: 'var(--text-mid)' }}>무료</span>
            </div>
          </div>

          <div
            className="flex justify-between font-bold text-base py-4 border-t"
            style={{ borderColor: 'var(--pink-light)' }}
          >
            <span style={{ color: 'var(--text-dark)' }}>최종 결제금액</span>
            <span style={{ color: 'var(--pink-deep)' }}>{total.toLocaleString()}원</span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 mt-2"
            style={{
              background: 'linear-gradient(135deg, var(--pink-main), var(--pink-deep))',
              boxShadow: '0 4px 16px rgba(232,98,154,0.4)',
            }}
          >
            {total.toLocaleString()}원 결제하기
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-2xl text-sm font-medium mt-3 transition-colors hover:bg-pink-50"
            style={{ color: 'var(--text-light)' }}
          >
            쇼핑 계속하기
          </button>
        </div>

      </div>
    </main>
  )
}