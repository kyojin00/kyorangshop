'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const STATUS_LABEL: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소',
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  paid: '#3B82F6',
  shipping: '#F97316',
  delivered: '#22C55E',
  cancelled: '#9CA3AF',
}

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  shop_order_items: { product_name: string; quantity: number; product_price: number }[]
}

interface Point {
  amount: number
  reason: string | null
  created_at: string
}

export default function MypageClient({
  email,
  totalPoints,
  orders,
  points,
  cartCount,
  shippingCount,
  paidCount,
}: {
  email: string
  totalPoints: number
  orders: Order[]
  points: Point[]
  cartCount: number
  shippingCount: number
  paidCount: number
}) {
  const [tab, setTab] = useState<'orders' | 'points'>('orders')
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* 상단 핑크 바 */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FFB6D3, #E8629A, #C97BB2)' }} />

      {/* 프로필 헤더 */}
      <div
        style={{ background: 'linear-gradient(160deg, #FFB6D3 0%, #E8629A 100%)' }}
        className="pb-16 pt-10 px-4 text-center relative overflow-hidden"
      >
        <div className="absolute top-4 right-[-30px] w-40 h-40 rounded-full opacity-15" style={{ backgroundColor: '#fff' }} />
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />

        <div className="relative">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', border: '3px solid rgba(255,255,255,0.5)' }}
          >
            <Image src="/logo.png" alt="프로필" width={48} height={48} />
          </div>
          <p className="text-white font-bold text-lg">{email.split('@')[0]}</p>
          <p className="text-white/70 text-sm">{email}</p>
        </div>
      </div>

      {/* 스탯 카드 */}
      <div className="max-w-2xl mx-auto px-4 -mt-8">
        <div
          className="bg-white rounded-3xl p-5 grid grid-cols-4 gap-2"
          style={{ boxShadow: '0 4px 24px rgba(232,98,154,0.12)' }}
        >
          {[
            { label: '주문', value: orders.length, suffix: '건', action: () => setTab('orders') },
            { label: '배송중', value: shippingCount, suffix: '건', action: () => setTab('orders') },
            { label: '장바구니', value: cartCount, suffix: '개', action: () => router.push('/cart') },
            { label: '포인트', value: totalPoints.toLocaleString(), suffix: 'P', action: () => setTab('points') },
          ].map((stat, i) => (
            <button
              key={i}
              onClick={stat.action}
              className="flex flex-col items-center py-2 rounded-2xl transition-colors hover:bg-pink-50"
            >
              <p className="text-xl font-bold" style={{ color: 'var(--pink-deep)' }}>
                {stat.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                {stat.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/cart')}
            className="bg-white rounded-2xl p-4 flex items-center gap-3 transition-all hover:shadow-md"
            style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--peach)' }}
            >
              <svg width="18" height="18" fill="none" stroke="var(--pink-deep)" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>장바구니</p>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>{cartCount}개 담겨있어요</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/orders')}
            className="bg-white rounded-2xl p-4 flex items-center gap-3 transition-all hover:shadow-md"
            style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--peach)' }}
            >
              <svg width="18" height="18" fill="none" stroke="var(--pink-deep)" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>주문내역</p>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>총 {orders.length}건</p>
            </div>
          </button>
        </div>
      </div>

      {/* 배송 중 주문 강조 */}
      {shippingCount > 0 && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #FFE4EC, #FFB6D3)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            >
              <svg width="18" height="18" fill="none" stroke="var(--pink-deep)" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 5v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--pink-deep)' }}>배송 중인 주문이 {shippingCount}건 있어요</p>
              <p className="text-xs" style={{ color: 'var(--text-mid)' }}>곧 도착할 거예요!</p>
            </div>
          </div>
        </div>
      )}

      {/* 탭 */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex gap-2 mb-5">
          {(['orders', 'points'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={tab === t
                ? { backgroundColor: 'var(--pink-main)', color: 'white', boxShadow: '0 4px 12px rgba(232,98,154,0.35)' }
                : { backgroundColor: 'white', color: 'var(--text-mid)', border: '1px solid var(--pink-light)' }
              }
            >
              {t === 'orders' ? `주문내역 ${orders.length}` : `포인트 ${totalPoints.toLocaleString()}P`}
            </button>
          ))}
        </div>

        {/* 주문내역 탭 */}
        {tab === 'orders' && (
          <div className="space-y-3 mb-8">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Image src="/logo.png" alt="교랑" width={56} height={56} className="mx-auto opacity-25 mb-3" />
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>주문 내역이 없어요</p>
              </div>
            ) : orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5"
                style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: STATUS_COLOR[order.status] ?? '#ccc' }}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.shop_order_items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-mid)' }}>{item.product_name} × {item.quantity}</span>
                      <span style={{ color: 'var(--text-mid)' }}>{(item.product_price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex justify-between items-center pt-3 border-t"
                  style={{ borderColor: 'var(--pink-light)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-light)' }}>총 결제금액</span>
                  <span className="font-bold" style={{ color: 'var(--pink-deep)' }}>
                    {order.total_amount.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 포인트 탭 */}
        {tab === 'points' && (
          <div className="mb-8">
            {/* 포인트 잔액 */}
            <div
              className="rounded-3xl p-6 mb-4 text-center"
              style={{ background: 'linear-gradient(135deg, #FFB6D3, #E8629A)' }}
            >
              <p className="text-white/80 text-sm mb-1">보유 포인트</p>
              <p className="text-white font-bold text-4xl">{totalPoints.toLocaleString()}<span className="text-xl ml-1">P</span></p>
            </div>

            {/* 포인트 내역 */}
            <div className="space-y-3">
              {points.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: 'var(--text-light)' }}>포인트 내역이 없어요</p>
                </div>
              ) : points.map((point, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 flex justify-between items-center"
                  style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                      {point.reason ?? '포인트 적립'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                      {new Date(point.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <span
                    className="font-bold"
                    style={{ color: point.amount > 0 ? 'var(--pink-deep)' : '#9CA3AF' }}
                  >
                    {point.amount > 0 ? '+' : ''}{point.amount.toLocaleString()}P
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl text-sm transition-colors hover:bg-pink-50 mb-8"
          style={{ color: 'var(--text-light)', border: '1px solid var(--pink-light)' }}
        >
          로그아웃
        </button>
      </div>
    </main>
  )
}