'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  images: string[]
  category: string | null
}

export default function ProductDetailClient({
  product,
  userId,
}: {
  product: Product
  userId: string | null
}) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleAddCart = async () => {
    if (!userId) {
      router.push('/login')
      return
    }
    setLoading(true)
    const supabase = createClient()

    const { data: existing } = await supabase
      .from('shop_carts')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('shop_carts')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('shop_carts')
        .insert({ user_id: userId, product_id: product.id, quantity })
    }

    setLoading(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = async () => {
    if (!userId) {
      router.push('/login')
      return
    }
    setLoading(true)
    const supabase = createClient()

    const { data: existing } = await supabase
      .from('shop_carts')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('shop_carts')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('shop_carts')
        .insert({ user_id: userId, product_id: product.id, quantity })
    }

    setLoading(false)
    router.push('/checkout')
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* 상단 배경 */}
      <div
        className="h-2 w-full"
        style={{ background: 'linear-gradient(90deg, #FFB6D3, #E8629A, #C97BB2)' }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm mb-8 transition-colors hover:opacity-70"
          style={{ color: 'var(--pink-deep)' }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          목록으로
        </button>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* 이미지 영역 */}
          <div>
            {/* 메인 이미지 */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden mb-3"
              style={{ backgroundColor: 'var(--peach)' }}
            >
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image src="/logo.png" alt="교랑" width={100} height={100} className="opacity-25" />
                </div>
              )}

              {/* 카테고리 뱃지 */}
              {product.category && (
                <div
                  className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--pink-deep)' }}
                >
                  {product.category}
                </div>
              )}

              {/* 품절 오버레이 */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
                  <span className="text-white font-bold text-lg bg-black/50 px-5 py-2 rounded-full">품절</span>
                </div>
              )}
            </div>

            {/* 서브 이미지 */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden transition-all"
                    style={{
                      border: selectedImage === i ? '2.5px solid var(--pink-main)' : '2px solid transparent',
                      opacity: selectedImage === i ? 1 : 0.6,
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className="flex flex-col gap-5">

            {/* 상품명 + 가격 */}
            <div
              className="rounded-3xl p-6"
              style={{ backgroundColor: 'white', boxShadow: '0 2px 16px rgba(232,98,154,0.08)' }}
            >
              <h1
                className="text-2xl font-bold leading-snug mb-3"
                style={{ color: 'var(--text-dark)' }}
              >
                {product.name}
              </h1>
              <p
                className="text-3xl font-bold"
                style={{ color: 'var(--pink-deep)' }}
              >
                {product.price.toLocaleString()}
                <span className="text-base font-normal ml-1" style={{ color: 'var(--text-light)' }}>원</span>
              </p>

              {/* 재고 상태 */}
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: product.stock > 0 ? '#4CAF50' : '#ccc' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-light)' }}>
                  {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
                </span>
              </div>
            </div>

            {/* 상품 설명 */}
            {product.description && (
              <div
                className="rounded-3xl p-6"
                style={{ backgroundColor: 'var(--peach)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* 수량 선택 */}
            {product.stock > 0 && (
              <div
                className="rounded-3xl p-6"
                style={{ backgroundColor: 'white', boxShadow: '0 2px 16px rgba(232,98,154,0.08)' }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-mid)' }}>수량</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                    style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
                  >
                    -
                  </button>
                  <span
                    className="text-xl font-bold w-8 text-center"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                    style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
                  >
                    +
                  </button>
                  <span className="text-sm ml-2 font-medium" style={{ color: 'var(--pink-deep)' }}>
                    총 {(product.price * quantity).toLocaleString()}원
                  </span>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                disabled={loading || product.stock === 0}
                className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: product.stock > 0
                    ? 'linear-gradient(135deg, var(--pink-main), var(--pink-deep))'
                    : '#ccc',
                  boxShadow: product.stock > 0 ? '0 4px 16px rgba(232,98,154,0.4)' : 'none',
                }}
              >
                {product.stock === 0 ? '품절' : '바로 구매'}
              </button>

              <button
                onClick={handleAddCart}
                disabled={loading || product.stock === 0}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: added ? 'var(--peach)' : 'white',
                  color: added ? 'var(--pink-deep)' : 'var(--pink-deep)',
                  border: '2px solid var(--pink-light)',
                }}
              >
                {added ? '장바구니에 담겼어요!' : '장바구니 담기'}
              </button>
            </div>

            {/* 배송 안내 */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ backgroundColor: 'var(--peach)' }}
            >
              {[
                { icon: '📦', text: '주문 후 2~5일 내 발송' },
                { icon: '🔄', text: '상품 불량 시 교환/환불 가능' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs" style={{ color: 'var(--text-mid)' }}>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}