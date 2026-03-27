'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
      .single()

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
    router.push('/cart')
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* 이미지 */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  style={{ backgroundColor: 'var(--peach)' }}
                  className="w-full h-full flex items-center justify-center text-6xl"
                >
                  🐱
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-purple-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col">
            {product.category && (
              <p className="text-sm text-gray-400 mb-1">{product.category}</p>
            )}
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
              {product.name}
            </h1>
            <p className="text-2xl font-bold mb-4" style={{ color: 'var(--deep-purple)' }}>
              {product.price.toLocaleString()}원
            </p>

            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* 재고 */}
            <p className="text-sm text-gray-400 mb-4">
              재고: {product.stock > 0 ? `${product.stock}개` : '품절'}
            </p>

            {/* 수량 */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddCart}
              disabled={loading || product.stock === 0}
              style={{ backgroundColor: product.stock > 0 ? 'var(--deep-purple)' : '#ccc' }}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : product.stock > 0 ? '장바구니 담기' : '품절'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}