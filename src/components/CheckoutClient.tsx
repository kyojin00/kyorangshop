'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function CheckoutClient({
  cartItems,
  userId,
}: {
  cartItems: CartItem[]
  userId: string
}) {
  const [form, setForm] = useState({
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    receiver_address_detail: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const itemName = cartItems.length === 1
    ? cartItems[0].product.name
    : `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.receiver_name || !form.receiver_phone || !form.receiver_address) {
      alert('배송 정보를 모두 입력해주세요')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/kakao-pay/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: itemName,
          quantity: totalCount,
          total_amount: total,
          form,
          cartItems,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // 카카오페이 결제창 이동
      window.location.href = data.next_redirect_pc_url
    } catch (err) {
      alert('결제 준비 중 오류가 발생했어요')
      setLoading(false)
    }
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-dark)' }}>주문하기</h1>

        {/* 주문 상품 요약 */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">주문 상품</h2>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b last:border-0">
              <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
              <span className="font-medium">{(item.product.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4 pt-2">
            <span>총 결제금액</span>
            <span style={{ color: 'var(--deep-purple)' }}>{total.toLocaleString()}원</span>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">배송 정보</h2>
          <div className="space-y-3">
            {[
              { name: 'receiver_name', placeholder: '받는 분 이름' },
              { name: 'receiver_phone', placeholder: '연락처 (010-0000-0000)' },
              { name: 'receiver_address', placeholder: '주소' },
              { name: 'receiver_address_detail', placeholder: '상세 주소 (선택)' },
            ].map(field => (
              <input
                key={field.name}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: '#FEE500', color: '#3A1D1D' }}
        >
          {loading ? '처리 중...' : `카카오페이로 ${total.toLocaleString()}원 결제`}
        </button>
      </div>
    </main>
  )
}