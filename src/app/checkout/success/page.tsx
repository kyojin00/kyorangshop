'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CheckoutSuccessClient() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const pg_token = params.get('pg_token')
    const order_id = params.get('order_id')

    if (!pg_token || !order_id) {
      setStatus('error')
      return
    }

    fetch('/api/kakao-pay/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pg_token, order_id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setStatus('success')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="text-center">
        {status === 'loading' && <p className="text-gray-500">결제 확인 중...</p>}
        {status === 'success' && (
          <>
            <p className="text-5xl mb-4">🎉</p>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--deep-purple)' }}>결제 완료!</h1>
            <p className="text-gray-500 mb-6">주문이 접수되었어요</p>
            <button
              onClick={() => router.push('/orders')}
              style={{ backgroundColor: 'var(--deep-purple)' }}
              className="text-white px-6 py-3 rounded-full"
            >
              주문 내역 보기
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-5xl mb-4">😢</p>
            <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
            <button onClick={() => router.push('/cart')} className="text-purple-500 underline">
              장바구니로 돌아가기
            </button>
          </>
        )}
      </div>
    </main>
  )
}