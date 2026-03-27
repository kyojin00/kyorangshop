import Link from 'next/link'
import Image from 'next/image'

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
        style={{ boxShadow: '0 2px 12px rgba(232,98,154,0.08)' }}
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
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="교랑"
                width={56}
                height={56}
                className="opacity-30"
              />
            </div>
          )}

          {/* 품절 뱃지 */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">품절</span>
            </div>
          )}

          {/* 카테고리 뱃지 */}
          {product.category && (
            <div
              className="absolute top-2.5 left-2.5 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.88)', color: 'var(--pink-deep)' }}
            >
              {product.category}
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="p-4">
          <p
            className="font-medium text-sm leading-snug mb-1.5 line-clamp-2"
            style={{ color: 'var(--text-dark)' }}
          >
            {product.name}
          </p>
          <p
            className="font-bold text-base"
            style={{ color: 'var(--pink-deep)' }}
          >
            {product.price.toLocaleString()}
            <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-light)' }}>원</span>
          </p>
        </div>
      </div>
    </Link>
  )
}