'use client'

import { useRouter } from 'next/navigation'

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
  pending: 'text-yellow-500',
  paid: 'text-blue-500',
  shipping: 'text-orange-500',
  delivered: 'text-green-500',
  cancelled: 'text-gray-400',
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const router = useRouter()

  if (orders.length === 0) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="mb-4">주문 내역이 없어요</p>
          <button
            onClick={() => router.push('/')}
            style={{ backgroundColor: 'var(--deep-purple)' }}
            className="text-white px-6 py-3 rounded-full"
          >
            쇼핑하러 가기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-dark)' }}>주문 내역</h1>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('ko-KR')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">주문번호: {order.id.slice(0, 8)}</p>
                </div>
                <span className={`text-sm font-bold ${STATUS_COLOR[order.status]}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.shop_order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                    <span>{(item.product_price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between">
                <div className="text-sm text-gray-400">
                  <p>{order.receiver_name}</p>
                  <p>{order.receiver_address}</p>
                </div>
                <p className="font-bold" style={{ color: 'var(--deep-purple)' }}>
                  {order.total_amount.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}