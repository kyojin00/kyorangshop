'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

const STATUS_DESC: Record<string, string> = {
  pending: '아직 결제가 완료되지 않은 주문이에요.',
  paid: '결제가 완료되었어요. 곧 준비를 시작할게요!',
  shipping: '상품이 배송 중이에요. 조금만 기다려주세요!',
  delivered: '배송이 완료되었어요. 상품은 잘 받으셨나요?',
  cancelled: '취소된 주문이에요.',
}

export default function OrderDetailClient({ order }: { order: any }) {
  const [payLoading, setPayLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const router = useRouter()

  const handlePay = async () => {
    setPayLoading(true)
    try {
      const res = await fetch('/api/kakao-pay/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: order.shop_order_items.length === 1
            ? order.shop_order_items[0].product_name
            : `${order.shop_order_items[0].product_name} 외 ${order.shop_order_items.length - 1}건`,
          quantity: order.shop_order_items.reduce((s: number, i: any) => s + i.quantity, 0),
          total_amount: order.total_amount,
          form: {
            receiver_name: order.receiver_name,
            receiver_phone: order.receiver_phone,
            receiver_address: order.receiver_address,
            receiver_address_detail: order.receiver_address_detail ?? '',
          },
          cartItems: order.shop_order_items.map((i: any) => ({
            product: { id: i.product_id, name: i.product_name, price: i.product_price, images: [], stock: 99 },
            quantity: i.quantity,
          })),
          existing_order_id: order.id,
        }),
      })
      const data = await res.json()
      if (data.next_redirect_pc_url) window.location.href = data.next_redirect_pc_url
      else alert('결제 준비 중 오류가 발생했어요')
    } catch {
      alert('결제 준비 중 오류가 발생했어요')
    }
    setPayLoading(false)
  }

  const handleCancel = async () => {
    if (!confirm('주문을 취소할까요?')) return
    setCancelLoading(true)
    const res = await fetch('/api/orders/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    })
    if (res.ok) {
      router.push('/orders')
      router.refresh()
    } else {
      alert('취소 중 오류가 발생했어요')
    }
    setCancelLoading(false)
  }

  const totalItems = order.shop_order_items.reduce((s: number, i: any) => s + i.quantity, 0)

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FFB6D3, #E8629A, #C97BB2)' }} />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-60"
          style={{ color: 'var(--pink-deep)' }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          주문내역으로
        </button>

        {/* 상태 배너 */}
        <div
          className="rounded-3xl p-6 mb-6 flex items-center gap-5 relative overflow-hidden"
          style={{
            background: order.status === 'pending'
              ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
              : order.status === 'shipping'
              ? 'linear-gradient(135deg, #FFEDD5, #FED7AA)'
              : order.status === 'delivered'
              ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'
              : 'linear-gradient(135deg, #FFE4EC, #FFCDE0)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            {order.status === 'pending' && (
              <svg width="24" height="24" fill="none" stroke="#F59E0B" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            )}
            {order.status === 'paid' && (
              <svg width="24" height="24" fill="none" stroke="#3B82F6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
            {order.status === 'shipping' && (
              <svg width="24" height="24" fill="none" stroke="#F97316" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 5v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            )}
            {order.status === 'delivered' && (
              <svg width="24" height="24" fill="none" stroke="#22C55E" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {order.status === 'cancelled' && (
              <svg width="24" height="24" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-sm font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: STATUS_COLOR[order.status] ?? '#ccc' }}
              >
                {STATUS_LABEL[order.status]}
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-mid)' }}>
              {STATUS_DESC[order.status]}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {/* 왼쪽: 주문 정보 */}
          <div className="md:col-span-2 space-y-4">

            {/* 주문 상품 */}
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
            >
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--pink-light)' }}>
                <p className="font-bold" style={{ color: 'var(--text-dark)' }}>주문 상품</p>
                <span className="text-sm" style={{ color: 'var(--text-light)' }}>{totalItems}개</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--pink-light)' }}>
                {order.shop_order_items.map((item: any) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--peach)' }}
                    >
                      <Image src="/logo.png" alt="상품" width={32} height={32} className="opacity-30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--text-dark)' }}>
                        {item.product_name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                        {item.product_price.toLocaleString()}원 × {item.quantity}개
                      </p>
                    </div>
                    <p className="font-bold flex-shrink-0" style={{ color: 'var(--pink-deep)' }}>
                      {(item.product_price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div
              className="bg-white rounded-3xl p-6"
              style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
            >
              <p className="font-bold mb-4" style={{ color: 'var(--text-dark)' }}>배송 정보</p>
              <div className="space-y-3">
                {[
                  { label: '받는 분', value: order.receiver_name },
                  { label: '연락처', value: order.receiver_phone },
                  { label: '주소', value: order.receiver_address },
                  ...(order.receiver_address_detail ? [{ label: '상세 주소', value: order.receiver_address_detail }] : []),
                ].map((row, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-sm w-20 flex-shrink-0" style={{ color: 'var(--text-light)' }}>{row.label}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 오른쪽: 결제 요약 */}
          <div className="space-y-4">
            <div
              className="bg-white rounded-3xl p-6 sticky top-24"
              style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.07)' }}
            >
              <p className="font-bold mb-4" style={{ color: 'var(--text-dark)' }}>결제 정보</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-light)' }}>주문번호</span>
                  <span className="font-medium text-xs" style={{ color: 'var(--text-mid)' }}>
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-light)' }}>주문일시</span>
                  <span className="font-medium text-xs" style={{ color: 'var(--text-mid)' }}>
                    {new Date(order.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-light)' }}>상품금액</span>
                  <span style={{ color: 'var(--text-mid)' }}>{order.total_amount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-light)' }}>배송비</span>
                  <span style={{ color: 'var(--text-mid)' }}>무료</span>
                </div>
              </div>

              <div
                className="flex justify-between font-bold pt-4 border-t mb-5"
                style={{ borderColor: 'var(--pink-light)' }}
              >
                <span style={{ color: 'var(--text-dark)' }}>최종 결제</span>
                <span className="text-lg" style={{ color: 'var(--pink-deep)' }}>
                  {order.total_amount.toLocaleString()}원
                </span>
              </div>

              {/* 결제 대기 - 결제 버튼 */}
              {order.status === 'pending' && (
                <div className="space-y-2">
                  <button
                    onClick={handlePay}
                    disabled={payLoading}
                    className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, var(--pink-main), var(--pink-deep))',
                      boxShadow: '0 4px 16px rgba(232,98,154,0.4)',
                    }}
                  >
                    {payLoading ? '처리 중...' : '카카오페이로 결제하기'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="w-full py-3 rounded-2xl text-sm font-medium transition-colors hover:bg-red-50 disabled:opacity-60"
                    style={{ color: '#EF4444', border: '1px solid #FCA5A5' }}
                  >
                    {cancelLoading ? '취소 중...' : '주문 취소'}
                  </button>
                </div>
              )}

              {/* 결제 완료 이후 상태 */}
              {['paid', 'shipping', 'delivered'].includes(order.status) && (
                <div
                  className="text-center py-3 rounded-2xl text-sm font-medium"
                  style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
                >
                  {order.status === 'paid' ? '결제 완료' : order.status === 'shipping' ? '배송 중' : '배송 완료'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}