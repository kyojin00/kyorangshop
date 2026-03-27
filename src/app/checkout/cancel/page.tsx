'use client'

import { useRouter } from 'next/navigation'

export default function CheckoutCancelPage() {
  const router = useRouter()
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="text-center">
        <p className="text-5xl mb-4">😅</p>
        <h1 className="text-xl font-bold mb-2">결제가 취소되었어요</h1>
        <button onClick={() => router.push('/cart')} className="text-purple-500 underline text-sm">
          장바구니로 돌아가기
        </button>
      </div>
    </main>
  )
}