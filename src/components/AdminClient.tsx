'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface AdminClientProps {
  products: any[]
  orders: any[]
}

const STATUS_LABEL: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소',
}

const CATEGORIES = ['신상', '베스트', '재입고', '세일', '문구/스티커', '키링/액세서리', '엽서/포스터', '에코백/파우치', '컵/텀블러']

const emptyForm = {
  name: '',
  description: '',
  detail_content: '',
  price: '',
  stock: '',
  category: '',
  is_active: true,
  images: [] as string[],
}

export default function AdminClient({ products: initialProducts, orders: initialOrders }: AdminClientProps) {
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [detailTab, setDetailTab] = useState<'write' | 'preview'>('write')

  const supabase = createClient()

  const handleImageUpload = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of imageFiles) {
      const ext = file.name.split('.').pop()
      const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('shop-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('shop-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  const handleSubmit = async () => {
    setLoading(true)
    const uploadedUrls = await handleImageUpload()
    const images = [...form.images, ...uploadedUrls]

    const payload = {
      name: form.name,
      description: form.description || null,
      detail_content: form.detail_content || null,
      price: parseInt(form.price),
      stock: parseInt(form.stock),
      category: form.category || null,
      is_active: form.is_active,
      images,
    }

    if (editId) {
      const { data } = await supabase.from('shop_products').update(payload).eq('id', editId).select().single()
      if (data) setProducts(prev => prev.map(p => p.id === editId ? data : p))
    } else {
      const { data } = await supabase.from('shop_products').insert(payload).select().single()
      if (data) setProducts(prev => [data, ...prev])
    }

    setForm(emptyForm)
    setImageFiles([])
    setEditId(null)
    setShowForm(false)
    setLoading(false)
  }

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description ?? '',
      detail_content: product.detail_content ?? '',
      price: String(product.price),
      stock: String(product.stock),
      category: product.category ?? '',
      is_active: product.is_active,
      images: product.images ?? [],
    })
    setEditId(product.id)
    setShowForm(true)
    setDetailTab('write')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    await supabase.from('shop_products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    await supabase.from('shop_orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const insertDetailTemplate = () => {
    const template = `📦 상품 정보
--------------------------
소재: 
사이즈: 
제조국: 

✨ 상품 특징
--------------------------
• 
• 
• 

📌 주의사항
--------------------------
• 
• `
    setForm(prev => ({ ...prev, detail_content: template }))
  }

  return (
    <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-dark)' }}>관리자</h1>

        {/* 탭 */}
        <div className="flex gap-2 mb-8">
          {(['products', 'orders'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
              style={tab === t
                ? { backgroundColor: 'var(--pink-main)', color: 'white' }
                : { backgroundColor: 'white', color: 'var(--text-mid)', border: '1px solid var(--pink-light)' }
              }
            >
              {t === 'products' ? '상품 관리' : '주문 관리'}
            </button>
          ))}
        </div>

        {/* 상품 관리 */}
        {tab === 'products' && (
          <>
            <button
              onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm) }}
              className="text-white px-5 py-2 rounded-full text-sm mb-6"
              style={{ backgroundColor: 'var(--pink-main)' }}
            >
              + 상품 추가
            </button>

            {/* 상품 폼 */}
            {showForm && (
              <div className="bg-white rounded-3xl p-6 mb-6" style={{ boxShadow: '0 2px 20px rgba(232,98,154,0.1)' }}>
                <h2 className="font-bold mb-5 text-lg" style={{ color: 'var(--text-dark)' }}>
                  {editId ? '상품 수정' : '상품 추가'}
                </h2>

                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    placeholder="상품명"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none col-span-2"
                    style={{ borderColor: 'var(--pink-light)' }}
                  />
                  <input
                    type="number"
                    placeholder="가격 (원)"
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--pink-light)' }}
                  />
                  <input
                    type="number"
                    placeholder="재고 수량"
                    value={form.stock}
                    onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--pink-light)' }}
                  />
                </div>

                {/* 카테고리 선택 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setForm(prev => ({ ...prev, category: prev.category === cat ? '' : cat }))}
                      className="text-xs px-3 py-1.5 rounded-full transition-all"
                      style={form.category === cat
                        ? { backgroundColor: 'var(--pink-main)', color: 'white' }
                        : { backgroundColor: 'var(--peach)', color: 'var(--text-mid)' }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 짧은 설명 */}
                <textarea
                  placeholder="짧은 설명 (목록/상세 상단에 표시)"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none h-20 resize-none mb-3"
                  style={{ borderColor: 'var(--pink-light)' }}
                />

                {/* 상세 설명 에디터 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-mid)' }}>상세 설명</p>
                    <div className="flex gap-2">
                      <button
                        onClick={insertDetailTemplate}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
                      >
                        템플릿 불러오기
                      </button>
                      <button
                        onClick={() => setDetailTab('write')}
                        className="text-xs px-3 py-1 rounded-full"
                        style={detailTab === 'write'
                          ? { backgroundColor: 'var(--pink-main)', color: 'white' }
                          : { backgroundColor: 'var(--peach)', color: 'var(--text-mid)' }
                        }
                      >
                        작성
                      </button>
                      <button
                        onClick={() => setDetailTab('preview')}
                        className="text-xs px-3 py-1 rounded-full"
                        style={detailTab === 'preview'
                          ? { backgroundColor: 'var(--pink-main)', color: 'white' }
                          : { backgroundColor: 'var(--peach)', color: 'var(--text-mid)' }
                        }
                      >
                        미리보기
                      </button>
                    </div>
                  </div>

                  {detailTab === 'write' ? (
                    <textarea
                      placeholder={`상품 상세 내용을 입력하세요.\n\n예시:\n📦 상품 정보\n소재: 면 100%\n사이즈: A6\n\n✨ 상품 특징\n• 교랑 캐릭터 디자인\n• 친환경 인쇄`}
                      value={form.detail_content}
                      onChange={e => setForm(prev => ({ ...prev, detail_content: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                      style={{ borderColor: 'var(--pink-light)', minHeight: '240px' }}
                    />
                  ) : (
                    <div
                      className="w-full border rounded-xl px-4 py-4 text-sm min-h-60"
                      style={{ borderColor: 'var(--pink-light)', backgroundColor: 'var(--peach)' }}
                    >
                      {form.detail_content ? (
                        <div
                          className="text-sm leading-loose whitespace-pre-wrap"
                          style={{ color: 'var(--text-mid)' }}
                        >
                          {form.detail_content}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--text-light)' }}>내용을 입력하면 여기서 미리볼 수 있어요</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 이미지 업로드 */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-mid)' }}>상품 이미지</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setImageFiles(Array.from(e.target.files ?? []))}
                    className="text-sm"
                  />
                  {form.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {form.images.map((url, i) => (
                        <div key={i} className="relative">
                          <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                          <button
                            onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                            className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 활성화 */}
                <div className="flex items-center gap-2 mb-5">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    id="is_active"
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm" style={{ color: 'var(--text-mid)' }}>판매 활성화</label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="text-white px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-60"
                    style={{ backgroundColor: 'var(--pink-main)' }}
                  >
                    {loading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditId(null) }}
                    className="px-6 py-3 rounded-xl text-sm"
                    style={{ backgroundColor: 'var(--peach)', color: 'var(--text-mid)' }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 상품 목록 */}
            <div className="space-y-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  style={{ boxShadow: '0 1px 8px rgba(232,98,154,0.07)' }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--peach)' }}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🐱</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                        {product.price.toLocaleString()}원 · 재고 {product.stock}개
                      </p>
                      {product.category && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--peach)', color: 'var(--pink-deep)' }}
                        >
                          {product.category}
                        </span>
                      )}
                    </div>
                    {!product.is_active && <span className="text-xs text-red-400">비활성</span>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-xs px-3 py-1.5 rounded-lg border"
                      style={{ color: 'var(--pink-deep)', borderColor: 'var(--pink-light)' }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-400"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 주문 관리 */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <p className="text-center py-12" style={{ color: 'var(--text-light)' }}>주문이 없어요</p>
            )}
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6"
                style={{ boxShadow: '0 1px 8px rgba(232,98,154,0.07)' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="font-medium mt-0.5">{order.receiver_name} · {order.receiver_phone}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>{order.receiver_address}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none"
                    style={{ borderColor: 'var(--pink-light)' }}
                  >
                    {Object.entries(STATUS_LABEL).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 mb-3">
                  {order.shop_order_items.map((item: any, i: number) => (
                    <p key={i} className="text-sm" style={{ color: 'var(--text-mid)' }}>
                      {item.product_name} × {item.quantity} — {(item.product_price * item.quantity).toLocaleString()}원
                    </p>
                  ))}
                </div>
                <p className="font-bold text-right" style={{ color: 'var(--pink-deep)' }}>
                  {order.total_amount.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}