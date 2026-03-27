'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  detail_content: string | null
  price: number
  stock: number
  images: string[]
  category: string | null
}

interface Review {
  id: string
  user_id: string
  rating: number
  content: string
  created_at: string
}

function StarRating({ rating, onChange, size = 20 }: { rating: number; onChange?: (r: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            background: 'none', border: 'none',
            cursor: onChange ? 'pointer' : 'default', padding: 0,
            color: star <= (hover || rating) ? '#FBBF24' : '#E5E7EB',
            fontSize: `${size}px`, lineHeight: 1,
          }}
        >★</button>
      ))}
    </div>
  )
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

  const [reviews, setReviews] = useState<Review[]>([])
  const [myReview, setMyReview] = useState<Review | null>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [reviewTab, setReviewTab] = useState<'list' | 'write'>('list')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // 리뷰 조회
      const { data: reviewData } = await supabase
        .from('shop_reviews')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false })

      if (reviewData) {
        setReviews(reviewData)
        if (userId) {
          const mine = reviewData.find(r => r.user_id === userId) ?? null
          setMyReview(mine)
          if (mine) { setRating(mine.rating); setContent(mine.content) }
        }
      }

      // 구매 여부 확인 (paid, shipping, delivered 상태 주문 중 해당 상품 포함 여부)
      if (userId) {
        const { data: orderItems } = await supabase
          .from('shop_order_items')
          .select('id, order_id, shop_orders!inner(status, user_id)')
          .eq('product_id', product.id)
          .filter('shop_orders.user_id', 'eq', userId)
          .filter('shop_orders.status', 'in', '("paid","shipping","delivered")')

        if (orderItems && orderItems.length > 0) {
          setHasPurchased(true)
        }
      }
    }
    fetchData()
  }, [product.id, userId])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleAddCart = async () => {
    if (!userId) { router.push('/login'); return }
    setLoading(true)
    const { data: existing } = await supabase.from('shop_carts').select('id, quantity').eq('user_id', userId).eq('product_id', product.id).maybeSingle()
    if (existing) {
      await supabase.from('shop_carts').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
    } else {
      await supabase.from('shop_carts').insert({ user_id: userId, product_id: product.id, quantity })
    }
    setLoading(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = async () => {
    if (!userId) { router.push('/login'); return }
    setLoading(true)
    const { data: existing } = await supabase.from('shop_carts').select('id, quantity').eq('user_id', userId).eq('product_id', product.id).maybeSingle()
    if (existing) {
      await supabase.from('shop_carts').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
    } else {
      await supabase.from('shop_carts').insert({ user_id: userId, product_id: product.id, quantity })
    }
    setLoading(false)
    router.push('/checkout')
  }

  const handleSubmitReview = async () => {
    if (!userId || !content.trim()) return
    setReviewLoading(true)
    if (myReview) {
      const { data } = await supabase.from('shop_reviews').update({ rating, content }).eq('id', myReview.id).select().single()
      if (data) { setReviews(prev => prev.map(r => r.id === myReview.id ? data : r)); setMyReview(data) }
    } else {
      const { data } = await supabase.from('shop_reviews').insert({ user_id: userId, product_id: product.id, rating, content }).select().single()
      if (data) { setReviews(prev => [data, ...prev]); setMyReview(data) }
    }
    setReviewLoading(false)
    setReviewTab('list')
  }

  const handleDeleteReview = async () => {
    if (!myReview || !confirm('리뷰를 삭제할까요?')) return
    await supabase.from('shop_reviews').delete().eq('id', myReview.id)
    setReviews(prev => prev.filter(r => r.id !== myReview.id))
    setMyReview(null)
    setRating(5)
    setContent('')
  }

  // 리뷰 작성 가능 여부
  const canWriteReview = userId && hasPurchased

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FFB6D3, #E8629A, #C97BB2)' }} />

      <div className="max-w-5xl mx-auto px-4 py-10">

        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-60"
          style={{ color: 'var(--pink-deep)' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          목록으로
        </button>

        {/* 상품 기본 정보 */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-3" style={{ backgroundColor: 'var(--peach)' }}>
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image src="/logo.png" alt="교랑" width={100} height={100} className="opacity-25" />
                </div>
              )}
              {product.category && (
                <div className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--pink-deep)' }}>
                  {product.category}
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
                  <span className="text-white font-bold text-lg bg-black/50 px-5 py-2 rounded-full">품절</span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden transition-all"
                    style={{ border: selectedImage === i ? '2.5px solid var(--pink-main)' : '2px solid transparent', opacity: selectedImage === i ? 1 : 0.6 }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-3xl p-6 bg-white" style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.08)' }}>
              <h1 className="text-2xl font-bold leading-snug mb-3" style={{ color: 'var(--text-dark)' }}>{product.name}</h1>
              <p className="text-3xl font-bold" style={{ color: 'var(--pink-deep)' }}>
                {product.price.toLocaleString()}<span className="text-base font-normal ml-1" style={{ color: 'var(--text-light)' }}>원</span>
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: product.stock > 0 ? '#4CAF50' : '#ccc' }} />
                  <span className="text-sm" style={{ color: 'var(--text-light)' }}>{product.stock > 0 ? `재고 ${product.stock}개` : '품절'}</span>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    <span style={{ color: '#FBBF24', fontSize: '14px' }}>★</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-mid)' }}>{avgRating}</span>
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>({reviews.length})</span>
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="rounded-3xl p-6" style={{ backgroundColor: 'var(--peach)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>{product.description}</p>
              </div>
            )}

            {product.stock > 0 && (
              <div className="rounded-3xl p-6 bg-white" style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.08)' }}>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-mid)' }}>수량</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}>-</button>
                  <span className="text-xl font-bold w-8 text-center" style={{ color: 'var(--text-dark)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}>+</button>
                  <span className="text-sm ml-2 font-medium" style={{ color: 'var(--pink-deep)' }}>총 {(product.price * quantity).toLocaleString()}원</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={handleBuyNow} disabled={loading || product.stock === 0}
                className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: product.stock > 0 ? 'linear-gradient(135deg, var(--pink-main), var(--pink-deep))' : '#ccc', boxShadow: product.stock > 0 ? '0 4px 16px rgba(232,98,154,0.4)' : 'none' }}>
                {product.stock === 0 ? '품절' : '바로 구매'}
              </button>
              <button onClick={handleAddCart} disabled={loading || product.stock === 0}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: added ? 'var(--peach)' : 'white', color: 'var(--pink-deep)', border: '2px solid var(--pink-light)' }}>
                {added ? '장바구니에 담겼어요!' : '장바구니 담기'}
              </button>
            </div>

            <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ backgroundColor: 'var(--peach)' }}>
              {[{ icon: '📦', text: '주문 후 2~5일 내 발송' }, { icon: '🔄', text: '상품 불량 시 교환/환불 가능' }].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-xs" style={{ color: 'var(--text-mid)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="mt-16">
          <div className="flex border-b-2 mb-8" style={{ borderColor: 'var(--pink-light)' }}>
            <div className="px-6 py-3 text-sm font-bold border-b-2 -mb-0.5" style={{ borderColor: 'var(--pink-main)', color: 'var(--pink-deep)' }}>
              상품 상세
            </div>
          </div>
          {product.detail_content ? (
            <div className="rounded-3xl p-8 bg-white" style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.06)' }}>
              <div className="text-sm leading-loose whitespace-pre-wrap" style={{ color: 'var(--text-mid)' }}>{product.detail_content}</div>
            </div>
          ) : (
            <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: 'var(--peach)' }}>
              <Image src="/logo.png" alt="교랑" width={48} height={48} className="mx-auto opacity-30 mb-3" />
              <p className="text-sm" style={{ color: 'var(--text-light)' }}>상세 설명을 준비 중이에요</p>
            </div>
          )}
        </div>

        {/* 리뷰 섹션 */}
        <div className="mt-12">
          <div className="flex items-center justify-between border-b-2 mb-8" style={{ borderColor: 'var(--pink-light)' }}>
            <div className="flex">
              <button onClick={() => setReviewTab('list')}
                className="px-6 py-3 text-sm font-bold border-b-2 -mb-0.5 transition-colors"
                style={reviewTab === 'list' ? { borderColor: 'var(--pink-main)', color: 'var(--pink-deep)' } : { borderColor: 'transparent', color: 'var(--text-light)' }}>
                리뷰 {reviews.length}
              </button>
              {canWriteReview && (
                <button onClick={() => setReviewTab('write')}
                  className="px-6 py-3 text-sm font-bold border-b-2 -mb-0.5 transition-colors"
                  style={reviewTab === 'write' ? { borderColor: 'var(--pink-main)', color: 'var(--pink-deep)' } : { borderColor: 'transparent', color: 'var(--text-light)' }}>
                  {myReview ? '내 리뷰 수정' : '리뷰 작성'}
                </button>
              )}
            </div>
            {avgRating && (
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: '#FBBF24', fontSize: '20px' }}>★</span>
                <span className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>{avgRating}</span>
                <span className="text-sm" style={{ color: 'var(--text-light)' }}>/ 5</span>
              </div>
            )}
          </div>

          {/* 리뷰 목록 */}
          {reviewTab === 'list' && (
            <div>
              {reviews.length === 0 ? (
                <div className="text-center py-16 rounded-3xl" style={{ backgroundColor: 'var(--peach)' }}>
                  <Image src="/logo.png" alt="교랑" width={48} height={48} className="mx-auto opacity-25 mb-3" />
                  <p className="text-sm" style={{ color: 'var(--text-mid)' }}>아직 리뷰가 없어요</p>
                  <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-light)' }}>구매 후 첫 번째 리뷰를 남겨주세요!</p>
                  {canWriteReview && (
                    <button onClick={() => setReviewTab('write')}
                      className="text-sm px-5 py-2 rounded-full text-white"
                      style={{ backgroundColor: 'var(--pink-main)' }}>
                      리뷰 작성하기
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.07)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--peach)' }}>
                            <Image src="/logo.png" alt="" width={20} height={20} className="opacity-50" />
                          </div>
                          <div>
                            <StarRating rating={review.rating} size={16} />
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>
                              {new Date(review.created_at).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                        {review.user_id === userId && (
                          <div className="flex gap-2">
                            <button onClick={() => setReviewTab('write')} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}>수정</button>
                            <button onClick={handleDeleteReview} className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-400">삭제</button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>{review.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 구매 안 한 경우 안내 */}
              {userId && !hasPurchased && (
                <div className="mt-4 text-center py-3 rounded-xl text-xs" style={{ backgroundColor: 'var(--peach)', color: 'var(--text-light)' }}>
                  구매한 상품에만 리뷰를 작성할 수 있어요
                </div>
              )}
              {!userId && (
                <div className="mt-4 text-center py-3 rounded-xl text-xs" style={{ backgroundColor: 'var(--peach)', color: 'var(--text-light)' }}>
                  로그인 후 구매하시면 리뷰를 작성할 수 있어요
                </div>
              )}
            </div>
          )}

          {/* 리뷰 작성 */}
          {reviewTab === 'write' && canWriteReview && (
            <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 2px 16px rgba(232,98,154,0.08)' }}>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-mid)' }}>별점</p>
                  <StarRating rating={rating} onChange={setRating} size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-mid)' }}>리뷰 내용</p>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="상품에 대한 솔직한 리뷰를 남겨주세요"
                    rows={5}
                    className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none"
                    style={{ border: '1.5px solid var(--pink-light)', backgroundColor: 'var(--cream)', color: 'var(--text-dark)' }}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSubmitReview} disabled={reviewLoading || !content.trim()}
                    className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, var(--pink-main), var(--pink-deep))', boxShadow: '0 4px 16px rgba(232,98,154,0.35)' }}>
                    {reviewLoading ? '저장 중...' : myReview ? '수정하기' : '등록하기'}
                  </button>
                  <button onClick={() => setReviewTab('list')}
                    className="px-6 py-3.5 rounded-2xl text-sm font-medium"
                    style={{ backgroundColor: 'var(--peach)', color: 'var(--text-mid)' }}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 유의사항 */}
        <div className="mt-8 rounded-2xl p-6" style={{ backgroundColor: 'var(--peach)' }}>
          <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-mid)' }}>유의사항</p>
          <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-light)' }}>
            <li>· 상품 색상은 모니터 환경에 따라 실제와 다소 다르게 보일 수 있어요.</li>
            <li>· 단순 변심에 의한 교환/반품은 배송비가 발생할 수 있어요.</li>
            <li>· 주문 취소는 결제 후 24시간 이내에 문의해주세요.</li>
          </ul>
        </div>

      </div>
    </main>
  )
}