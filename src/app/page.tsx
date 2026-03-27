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
      <main className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

        {/* 히어로 */}
        <div
          className="relative overflow-hidden pt-16"
          style={{
            background: 'linear-gradient(135deg, var(--deep-purple) 0%, var(--warm-purple) 60%, #B49FE0 100%)',
            minHeight: '380px',
          }}
        >
          {/* 배경 장식 */}
          <div className="absolute inset-0 overflow-hidden">
            {['10%', '30%', '55%', '75%', '90%'].map((left, i) => (
              <div
                key={i}
                className="absolute text-white/10 font-display select-none"
                style={{
                  left,
                  top: `${15 + i * 12}%`,
                  fontSize: `${40 + i * 15}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                🐱
              </div>
            ))}
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
            <div className="animate-float mb-4 text-6xl">🐱</div>
            <h1
              className="font-display text-5xl md:text-6xl text-white mb-3"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
            >
              교랑샵
            </h1>
            <p className="text-white/75 text-lg mb-8">
              교랑 캐릭터 공식 굿즈 🎀
            </p>
            <div
              className="px-6 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(10px)' }}
            >
              ✨ 지금 {products?.length ?? 0}개 상품 판매 중
            </div>
          </div>

          {/* 물결 */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,40 C360,0 1080,80 1440,40 L1440,60 L0,60 Z" fill="#FDF6EE" />
            </svg>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {products && products.length > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-8">
                <h2
                  className="font-display text-2xl"
                  style={{ color: 'var(--deep-purple)' }}
                >
                  전체 상품
                </h2>
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--peach)', color: 'var(--soft-brown)' }}
                >
                  {products.length}개
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <div className="animate-float inline-block text-6xl mb-4">🐱</div>
              <p style={{ color: 'var(--soft-brown)' }} className="text-lg font-medium">곧 만나요!</p>
              <p className="text-gray-400 text-sm mt-1">교랑 굿즈를 준비 중이에요</p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <footer
          className="mt-12 py-10 text-center"
          style={{ borderTop: '1px solid var(--peach)' }}
        >
          <p className="font-display text-xl mb-1" style={{ color: 'var(--deep-purple)' }}>교랑샵 🐱</p>
          <p className="text-xs text-gray-400">© 2026 KYORANG. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="https://kyorang.com" className="text-xs hover:underline" style={{ color: 'var(--soft-brown)' }}>회사 소개</a>
            <a href="https://kyorang.ai.kr" className="text-xs hover:underline" style={{ color: 'var(--soft-brown)' }}>교랑AI</a>
            <a href="https://talk.kyorang.com" className="text-xs hover:underline" style={{ color: 'var(--soft-brown)' }}>교랑톡</a>
          </div>
        </footer>
      </main>
    </>
  )
}