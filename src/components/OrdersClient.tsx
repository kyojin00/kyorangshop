'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export interface OrdersClientProps {
  orders: any[]
}

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

export default function OrdersClient({ orders }: OrdersClientProps) {
  const router = useRouter()

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FFB6D3, #E8629A, #C97BB2)' }} />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>주문내역</h1>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
          >
            총 {orders.length}건
          </span>
        </div>

        {orders.length === 0 ? (
          <div
            className="bg-white rounded-3xl p-20 text-center"
            style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
          >
            <Image src="/logo.png" alt="교랑" width={60} height={60} className="mx-auto opacity-20 mb-4" />
            <p className="font-medium" style={{ color: 'var(--text-mid)' }}>주문 내역이 없어요</p>
            <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-light)' }}>마음에 드는 상품을 담아보세요</p>
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
                className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg group"
                style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                {/* 헤더 */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ backgroundColor: 'var(--peach)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                      {new Date(order.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                      주문번호 {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: STATUS_COLOR[order.status] ?? '#ccc' }}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <svg
                      width="16" height="16" fill="none" stroke="var(--text-light)" strokeWidth="2" viewBox="0 0 24 24"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>

                {/* 상품 목록 */}
                <div className="px-6 py-5">
                  <div className="space-y-3 mb-4">
                    {order.shop_order_items.slice(0, 2).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <p className="text-sm flex-1 mr-4 truncate" style={{ color: 'var(--text-mid)' }}>
                          {item.product_name}
                          <span className="ml-1 text-xs" style={{ color: 'var(--text-light)' }}>×{item.quantity}</span>
                        </p>
                        <p className="text-sm font-medium flex-shrink-0" style={{ color: 'var(--text-dark)' }}>
                          {(item.product_price * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    ))}
                    {order.shop_order_items.length > 2 && (
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                        외 {order.shop_order_items.length - 2}개 상품
                      </p>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: 'var(--pink-light)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-light)' }}>총 결제금액</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg" style={{ color: 'var(--pink-deep)' }}>
                        {order.total_amount.toLocaleString()}원
                      </span>
                      {order.status === 'pending' && (
                        <span
                          className="text-xs px-3 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: '#F59E0B' }}
                        >
                          결제 필요
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}