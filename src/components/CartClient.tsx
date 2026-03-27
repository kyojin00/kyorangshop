'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

export default function CartClient({ cartItems: initial }: { cartItems: CartItem[] }) {
  const [items, setItems] = useState(initial)
  const router = useRouter()

  const supabase = createClient()

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity < 1) return
    await supabase.from('shop_carts').update({ quantity }).eq('id', cartId)
    setItems(prev => prev.map(i => i.id === cartId ? { ...i, quantity } : i))
  }

  const removeItem = async (cartId: string) => {
    await supabase.from('shop_carts').delete().eq('id', cartId)
    setItems(prev => prev.filter(i => i.id !== cartId))
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  if (items.length === 0) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p className="mb-4">장바구니가 비었어요</p>
          <button
            onClick={() => router.push('/')}
            style={{ backgroundColor: 'var(--deep-purple)' }}
            className="text-white px-6 py-3 rounded-full"
          >
            쇼핑 계속하기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-dark)' }}>장바구니</h1>

        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.product.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div style={{ backgroundColor: 'var(--peach)' }} className="w-full h-full flex items-center justify-center text-2xl">🐱</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="font-bold" style={{ color: 'var(--deep-purple)' }}>
                  {(item.product.price * item.quantity).toLocaleString()}원
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">-</button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 ml-2">✕</button>
            </div>
          ))}
        </div>

        {/* 결제 요약 */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">총 상품금액</span>
            <span className="font-bold">{total.toLocaleString()}원</span>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            style={{ backgroundColor: 'var(--deep-purple)' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90"
          >
            {total.toLocaleString()}원 주문하기
          </button>
        </div>
      </div>
    </main>
  )
}