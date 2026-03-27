'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: '신상', label: '신상' },
  { key: '베스트', label: '베스트' },
  { key: '재입고', label: '재입고' },
  { key: '세일', label: '세일' },
  { key: '문구/스티커', label: '문구/스티커' },
  { key: '키링/액세서리', label: '키링/액세서리' },
  { key: '엽서/포스터', label: '엽서/포스터' },
  { key: '에코백/파우치', label: '에코백/파우치' },
  { key: '컵/텀블러', label: '컵/텀블러' },
]

export default function HomeClient({ products }: { products: any[] }) {
  const [active, setActive] = useState('all')

  const filtered = active === 'all'
    ? products
    : products.filter(p => p.category === active)

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* 히어로 */}
      <div
        className="relative overflow-hidden pt-16"
        style={{
          background: 'linear-gradient(160deg, #FFB6D3 0%, #F9A8C9 40%, #E8629A 100%)',
          minHeight: '420px',
        }}
      >
        {/* 배경 원형 장식 */}
        <div className="absolute top-8 right-[-60px] w-72 h-72 rounded-full opacity-20" style={{ backgroundColor: '#fff' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full opacity-15" style={{ backgroundColor: '#fff' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-14 flex flex-col items-center text-center">
          <div className="animate-float mb-6 drop-shadow-2xl">
            <Image
              src="/logo.png"
              alt="교랑"
              width={120}
              height={120}
              priority
            />
          </div>
          <h1
            className="font-display text-5xl md:text-6xl text-white mb-3"
            style={{ textShadow: '0 2px 24px rgba(180,40,100,0.25)' }}
          >
            교랑샵
          </h1>
          <p className="text-white/80 text-base mb-6">
            교랑 캐릭터 공식 소품샵
          </p>
          <div
            className="px-5 py-2 rounded-full text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', backdropFilter: 'blur(8px)' }}
          >
            {products.length}개 상품 판매 중
          </div>
        </div>

        {/* 물결 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z" fill="#FFF5F7" />
          </svg>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className="flex-shrink-0 text-sm px-4 py-2 rounded-full font-medium transition-all duration-200"
              style={
                active === cat.key
                  ? { backgroundColor: 'var(--pink-main)', color: 'white', boxShadow: '0 4px 12px rgba(232,98,154,0.35)' }
                  : { backgroundColor: 'white', color: 'var(--text-mid)', border: '1px solid var(--pink-light)' }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-medium text-sm" style={{ color: 'var(--text-mid)' }}>
                {active === 'all' ? '전체' : active}
              </span>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
              >
                {filtered.length}개
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="animate-float inline-block mb-6">
              <Image src="/logo.png" alt="교랑" width={72} height={72} className="opacity-50" />
            </div>
            <p className="font-medium" style={{ color: 'var(--text-mid)' }}>해당 카테고리 상품이 없어요</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>곧 채워질 거예요!</p>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer
        className="mt-12 py-10 text-center"
        style={{ borderTop: '1px solid var(--pink-light)' }}
      >
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="교랑" width={28} height={28} />
        </div>
        <p className="font-display text-lg mb-1" style={{ color: 'var(--pink-deep)' }}>교랑샵</p>
        <p className="text-xs" style={{ color: 'var(--text-light)' }}>© 2026 KYORANG. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="https://kyorang.com" className="text-xs hover:underline" style={{ color: 'var(--text-light)' }}>회사 소개</a>
          <a href="https://kyorang.ai.kr" className="text-xs hover:underline" style={{ color: 'var(--text-light)' }}>교랑AI</a>
          <a href="https://talk.kyorang.com" className="text-xs hover:underline" style={{ color: 'var(--text-light)' }}>교랑톡</a>
        </div>
      </footer>
    </main>
  )
}