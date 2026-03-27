import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('shop_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
        {/* 히어로 */}
        <div
          style={{ backgroundColor: 'var(--deep-purple)' }}
          className="py-16 text-center text-white"
        >
          <h1 className="text-3xl font-bold mb-2">교랑샵 🐱</h1>
          <p className="text-white/70">교랑 캐릭터 공식 굿즈</p>
        </div>

        {/* 상품 목록 */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p className="text-5xl mb-4">🐱</p>
              <p>준비 중인 상품이 있어요</p>
              <p className="text-sm mt-1">곧 만나요!</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}