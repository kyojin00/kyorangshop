import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: string | null
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              style={{ backgroundColor: 'var(--peach)' }}
              className="w-full h-full flex items-center justify-center text-4xl"
            >
              🐱
            </div>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-gray-400 mb-1">{product.category}</p>
          )}
          <p className="font-medium text-sm" style={{ color: 'var(--text-dark)' }}>
            {product.name}
          </p>
          <p className="font-bold mt-1" style={{ color: 'var(--deep-purple)' }}>
            {product.price.toLocaleString()}원
          </p>
        </div>
      </div>
    </Link>
  )
}