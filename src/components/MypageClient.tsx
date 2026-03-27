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
    <main className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* 프로필 헤더 */}
      <div
        className="relative overflow-hidden pt-20 pb-24 px-4 text-center"
        style={{ background: 'linear-gradient(160deg, #FFCDE0 0%, #F0709E 60%, #C44D82 100%)' }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute top-[-40px] right-[-60px] w-56 h-56 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <div className="absolute bottom-[-30px] left-[-40px] w-44 h-44 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />

        <div className="relative">
          {/* 아바타 */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              border: '3px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 24px rgba(180,40,100,0.25)',
            }}
          >
            <Image src="/logo.png" alt="프로필" width={52} height={52} />
          </div>
          <p className="text-white font-bold text-xl mb-1">{email.split('@')[0]}</p>
          <p className="text-white/70 text-sm">{email}</p>
        </div>
      </div>

      {/* 스탯 카드 - 헤더에 겹쳐서 떠오르는 형태 */}
      <div className="max-w-lg mx-auto px-4 -mt-12 relative z-10">
        <div
          className="bg-white rounded-3xl p-5"
          style={{ boxShadow: '0 8px 32px rgba(232,98,154,0.15)' }}
        >
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: '전체주문', value: String(orders.length), unit: '건', action: () => setTab('orders') },
              { label: '배송중', value: String(shippingCount), unit: '건', action: () => setTab('orders') },
              { label: '장바구니', value: String(cartCount), unit: '개', action: () => router.push('/cart') },
              { label: '포인트', value: totalPoints >= 1000 ? (totalPoints / 1000).toFixed(1) + 'K' : String(totalPoints), unit: 'P', action: () => setTab('points') },
            ].map((stat, i) => (
              <button
                key={i}
                onClick={stat.action}
                className="flex flex-col items-center py-3 rounded-2xl transition-colors hover:bg-pink-50 group"
              >
                <p
                  className="text-2xl font-bold leading-none mb-1 transition-colors group-hover:text-pink-500"
                  style={{ color: 'var(--pink-deep)' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-light)' }}>{stat.unit}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)', fontSize: '10px' }}>{stat.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-5">

        {/* 배송 중 배너 */}
        {shippingCount > 0 && (
          <div
            className="rounded-2xl p-4 flex items-center gap-3 mb-4"
            style={{ background: 'linear-gradient(135deg, #FFE4EC, #FFCDE0)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
              <svg width="20" height="20" fill="none" stroke="var(--pink-deep)" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 5v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--pink-deep)' }}>
                배송 중인 주문 {shippingCount}건
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-mid)' }}>곧 도착할 거예요!</p>
            </div>
            <button
              onClick={() => setTab('orders')}
              className="ml-auto text-xs font-medium px-3 py-1.5 rounded-full bg-white transition-opacity hover:opacity-70"
              style={{ color: 'var(--pink-deep)' }}
            >
              확인
            </button>
          </div>
        )}

        {/* 빠른 메뉴 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            {
              label: '장바구니',
              sub: `${cartCount}개 담겨있어요`,
              action: () => router.push('/cart'),
              icon: (
                <svg width="20" height="20" fill="none" stroke="var(--pink-deep)" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              ),
            },
            {
              label: '주문내역',
              sub: `총 ${orders.length}건`,
              action: () => router.push('/orders'),
              icon: (
                <svg width="20" height="20" fill="none" stroke="var(--pink-deep)" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                </svg>
              ),
            },
          ].map((menu, i) => (
            <button
              key={i}
              onClick={menu.action}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 text-left transition-all hover:shadow-md"
              style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--peach)' }}
              >
                {menu.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-dark)' }}>{menu.label}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>{menu.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* 탭 */}
        <div
          className="flex bg-white rounded-2xl p-1 mb-5"
          style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
        >
          {(['orders', 'points'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={tab === t
                ? { backgroundColor: 'var(--pink-main)', color: 'white', boxShadow: '0 2px 8px rgba(232,98,154,0.3)' }
                : { color: 'var(--text-light)' }
              }
            >
              {t === 'orders' ? `주문내역 ${orders.length}건` : `포인트 ${totalPoints.toLocaleString()}P`}
            </button>
          ))}
        </div>

        {/* 주문내역 탭 */}
        {tab === 'orders' && (
          <div className="space-y-3 mb-8">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Image src="/logo.png" alt="교랑" width={52} height={52} className="mx-auto opacity-20 mb-3" />
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>주문 내역이 없어요</p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 text-sm px-5 py-2 rounded-full text-white"
                  style={{ backgroundColor: 'var(--pink-main)' }}
                >
                  쇼핑하러 가기
                </button>
              </div>
            ) : orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}
              >
                {/* 주문 헤더 */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ backgroundColor: 'var(--peach)' }}
                >
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-mid)' }}>
                      {new Date(order.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                      주문번호 {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: STATUS_COLOR[order.status] ?? '#ccc' }}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                {/* 주문 상품 */}
                <div className="px-5 py-4">
                  <div className="space-y-2 mb-3">
                    {order.shop_order_items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <p className="text-sm flex-1 mr-4 truncate" style={{ color: 'var(--text-mid)' }}>
                          {item.product_name}
                          <span className="text-xs ml-1" style={{ color: 'var(--text-light)' }}>×{item.quantity}</span>
                        </p>
                        <p className="text-sm font-medium flex-shrink-0" style={{ color: 'var(--text-dark)' }}>
                          {(item.product_price * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-between items-center pt-3 border-t"
                    style={{ borderColor: 'var(--pink-light)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>총 결제금액</span>
                    <span className="font-bold" style={{ color: 'var(--pink-deep)' }}>
                      {order.total_amount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 포인트 탭 */}
        {tab === 'points' && (
          <div className="mb-8">
            <div
              className="rounded-3xl p-6 mb-4 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FFCDE0, #E8629A)' }}
            >
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <p className="text-white/80 text-sm mb-2 relative">보유 포인트</p>
              <p className="text-white font-bold text-5xl relative">
                {totalPoints.toLocaleString()}
                <span className="text-2xl ml-1 font-medium">P</span>
              </p>
            </div>

            <div className="space-y-3">
              {points.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: 'var(--text-light)' }}>포인트 내역이 없어요</p>
                </div>
              ) : points.map((point, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl px-5 py-4 flex justify-between items-center"
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
                    className="font-bold text-base"
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
          className="w-full py-3.5 rounded-2xl text-sm font-medium transition-colors hover:bg-pink-50 mb-10"
          style={{ color: 'var(--text-light)', border: '1.5px solid var(--pink-light)' }}
        >
          로그아웃
        </button>

      </div>
    </main>
  )
}