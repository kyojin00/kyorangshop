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

      {/* 페이지 헤더 */}
      <div
        className="py-12"
        style={{ background: 'linear-gradient(160deg, #FFCDE0 0%, #F0709E 60%, #C44D82 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              border: '3px solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 24px rgba(180,40,100,0.2)',
            }}
          >
            <Image src="/logo.png" alt="프로필" width={44} height={44} />
          </div>
          <div>
            <p className="text-white font-bold text-2xl">{email.split('@')[0]}</p>
            <p className="text-white/70 text-sm mt-0.5">{email}</p>
          </div>
          <div className="ml-auto flex gap-6">
            {[
              { label: '전체 주문', value: `${orders.length}건` },
              { label: '배송 중', value: `${shippingCount}건` },
              { label: '포인트', value: `${totalPoints.toLocaleString()}P` },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-white/70 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 레이아웃 */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8 items-start">

        {/* 사이드바 */}
        <aside className="w-64 flex-shrink-0 sticky top-24">
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(232,98,154,0.1)' }}
          >
            <div className="p-4">
              <p className="text-xs font-bold px-3 mb-2" style={{ color: 'var(--text-light)' }}>마이페이지</p>
              {[
                {
                  key: 'orders',
                  label: '주문내역',
                  count: orders.length,
                  icon: (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                  ),
                },
                {
                  key: 'points',
                  label: '포인트',
                  count: totalPoints,
                  unit: 'P',
                  icon: (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  ),
                },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key as 'orders' | 'points')}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all mb-1"
                  style={tab === item.key
                    ? { backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }
                    : { color: 'var(--text-mid)' }
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: tab === item.key ? 'var(--pink-deep)' : 'var(--text-light)' }}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: tab === item.key ? 'var(--pink-main)' : 'var(--peach)',
                      color: tab === item.key ? 'white' : 'var(--pink-deep)',
                    }}
                  >
                    {item.count.toLocaleString()}{item.unit ?? ''}
                  </span>
                </button>
              ))}

              <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--pink-light)' }}>
                <button
                  onClick={() => router.push('/cart')}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all mb-1"
                  style={{ color: 'var(--text-mid)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="16" height="16" fill="none" stroke="var(--text-light)" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span className="text-sm font-medium">장바구니</span>
                  </div>
                  {cartCount > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl transition-all"
                  style={{ color: 'var(--text-mid)' }}
                >
                  <svg width="16" height="16" fill="none" stroke="var(--text-light)" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <span className="text-sm font-medium">쇼핑 계속하기</span>
                </button>
              </div>
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-sm transition-colors hover:bg-pink-50"
                style={{ color: 'var(--text-light)', border: '1px solid var(--pink-light)' }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </aside>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">

          {/* 배송 중 배너 */}
          {shippingCount > 0 && (
            <div
              className="rounded-2xl p-5 flex items-center gap-4 mb-6"
              style={{ background: 'linear-gradient(135deg, #FFE4EC, #FFCDE0)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
              >
                <svg width="22" height="22" fill="none" stroke="var(--pink-deep)" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 5v4h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--pink-deep)' }}>
                  배송 중인 주문이 {shippingCount}건 있어요
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-mid)' }}>
                  곧 도착할 거예요!
                </p>
              </div>
            </div>
          )}

          {/* 주문내역 */}
          {tab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-dark)' }}>주문내역</h2>
              {orders.length === 0 ? (
                <div
                  className="bg-white rounded-3xl p-16 text-center"
                  style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
                >
                  <Image src="/logo.png" alt="교랑" width={56} height={56} className="mx-auto opacity-20 mb-4" />
                  <p className="font-medium" style={{ color: 'var(--text-mid)' }}>주문 내역이 없어요</p>
                  <p className="text-sm mt-1 mb-5" style={{ color: 'var(--text-light)' }}>마음에 드는 상품을 담아보세요</p>
                  <button
                    onClick={() => router.push('/')}
                    className="text-white px-6 py-2.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: 'var(--pink-main)' }}
                  >
                    쇼핑하러 가기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl overflow-hidden"
                      style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
                    >
                      {/* 주문 헤더 */}
                      <div
                        className="px-6 py-4 flex items-center justify-between"
                        style={{ backgroundColor: 'var(--peach)' }}
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                              {new Date(order.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                              주문번호 {order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <span
                          className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
                          style={{ backgroundColor: STATUS_COLOR[order.status] ?? '#ccc' }}
                        >
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </div>

                      {/* 주문 상품 */}
                      <div className="px-6 py-5">
                        <div className="space-y-3 mb-4">
                          {order.shop_order_items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                                <div
                                  className="w-10 h-10 rounded-lg flex-shrink-0"
                                  style={{ backgroundColor: 'var(--peach)' }}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-dark)' }}>
                                    {item.product_name}
                                  </p>
                                  <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                                    {item.quantity}개
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium flex-shrink-0" style={{ color: 'var(--text-dark)' }}>
                                {(item.product_price * item.quantity).toLocaleString()}원
                              </p>
                            </div>
                          ))}
                        </div>
                        <div
                          className="flex justify-between items-center pt-4 border-t"
                          style={{ borderColor: 'var(--pink-light)' }}
                        >
                          <span className="text-sm" style={{ color: 'var(--text-light)' }}>총 결제금액</span>
                          <span className="font-bold text-lg" style={{ color: 'var(--pink-deep)' }}>
                            {order.total_amount.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 포인트 */}
          {tab === 'points' && (
            <div>
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-dark)' }}>포인트</h2>

              {/* 포인트 잔액 카드 */}
              <div
                className="rounded-3xl p-8 mb-6 flex items-center justify-between relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FFCDE0, #E8629A)' }}
              >
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <p className="text-white/80 text-sm mb-1">보유 포인트</p>
                  <p className="text-white font-bold text-5xl">
                    {totalPoints.toLocaleString()}
                    <span className="text-2xl ml-1 font-medium">P</span>
                  </p>
                </div>
                <div className="relative">
                  <Image src="/logo.png" alt="교랑" width={80} height={80} className="opacity-30" />
                </div>
              </div>

              {/* 포인트 내역 */}
              {points.length === 0 ? (
                <div
                  className="bg-white rounded-3xl p-16 text-center"
                  style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
                >
                  <p className="font-medium" style={{ color: 'var(--text-mid)' }}>포인트 내역이 없어요</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>구매 시 포인트가 적립돼요</p>
                </div>
              ) : (
                <div
                  className="bg-white rounded-3xl overflow-hidden"
                  style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--pink-light)' }}>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-mid)' }}>포인트 내역</p>
                  </div>
                  {points.map((point, i) => (
                    <div
                      key={i}
                      className="px-6 py-4 flex items-center justify-between border-b last:border-0"
                      style={{ borderColor: 'var(--pink-light)' }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                          {point.reason ?? '포인트 적립'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                          {new Date(point.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}