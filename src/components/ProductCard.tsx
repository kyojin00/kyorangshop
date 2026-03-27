import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: string | null
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="group bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        style={{ boxShadow: '0 2px 12px rgba(61,46,107,0.08)' }}
      >
        {/* 이미지 */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ backgroundColor: 'var(--peach)' }}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl group-hover:animate-float">
              🐱
            </div>
          )}

          {/* 품절 뱃지 */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full">품절</span>
            </div>
          )}

          {/* 카테고리 뱃지 */}
          {product.category && (
            <div
              className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(253,246,238,0.9)', color: 'var(--soft-brown)' }}
            >
              {product.category}
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="p-4">
          <p
            className="font-medium text-sm leading-snug mb-1 line-clamp-2"
            style={{ color: 'var(--text-dark)' }}
          >
            {product.name}
          </p>
          <p
            className="font-bold text-base"
            style={{ color: 'var(--deep-p