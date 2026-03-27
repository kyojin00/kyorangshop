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

const emptyForm = {
  name: '',
  description: '',
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

  const supabase = createClient()

  const handleImageUpload = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of imageFiles) {
      const path = `products/${Date.now()}_${file.name}`
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
      price: parseInt(form.price),
      stock: parseInt(form.stock),
      category: form.category || null,
      is_active: form.is_active,
      images,
    }

    if (editId) {
      const { data } = await supabase
        .from('shop_products')
        .update(payload)
        .eq('id', editId)
        .select()
        .single()
      if (data) setProducts(prev => prev.map(p => p.id === editId ? data : p))
    } else {
      const { data } = await supabase
        .from('shop_products')
        .insert(payload)
        .select()
        .single()
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
      price: String(product.price),
      stock: String(product.stock),
      category: product.category ?? '',
      is_active: product.is_active,
      images: product.images ?? [],
    })
    setEditId(product.id)
    setShowForm(true)
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t ? 'text-white' : 'bg-white text-gray-500'
              }`}
              style={tab === t ? { backgroundColor: 'var(--deep-purple)' } : {}}
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
              style={{ backgroundColor: 'var(--warm-purple)' }}
              className="text-white px-5 py-2 rounded-full text-sm mb-6"
            >
              + 상품 추가
            </button>

            {/* 상품 폼 */}
            {showForm && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h2 className="font-bold mb-4">{editId ? '상품 수정' : '상품 추가'}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'name', placeholder: '상품명' },
                    { name: 'category', placeholder: '카테고리' },
                    { name: 'price', placeholder: '가격 (원)', type: 'number' },
                    { name: 'stock', placeholder: '재고 수량', type: 'number' },
                  ].map(f => (
                    <input
                      key={f.name}
                      type={f.type ?? 'text'}
                      placeholder={f.placeholder}
                      value={form[f.name as keyof typeof form] as string}
                      onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
                    />
                  ))}
                </div>
                <textarea
                  placeholder="상품 설명"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-4 focus:outline-none focus:border-purple-400 h-24 resize-none"
                />
                <div className="mt-4">
                  <label className="text-sm text-gray-500 mb-2 block">상품 이미지</label>
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
                        <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    id="is_active"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-600">판매 활성화</label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ backgroundColor: 'var(--deep-purple)' }}
                    className="text-white px-6 py-3 rounded-xl text-sm disabled:opacity-60"
                  >
                    {loading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditId(null) }}
                    className="text-gray-500 px-6 py-3 rounded-xl text-sm bg-gray-100"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 상품 목록 */}
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div style={{ backgroundColor: 'var(--peach)' }} className="w-full h-full flex items-center justify-center">🐱</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.price.toLocaleString()}원 · 재고 {product.stock}개</p>
                    {!product.is_active && <span className="text-xs text-red-400">비활성</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="text-xs text-purple-500 border border-purple-200 px-3 py-1.5 rounded-lg">수정</button>
                    <button onClick={() => handleDelete(product.id)} className="text-xs text-red-400 border border-red-200 px-3 py-1.5 rounded-lg">삭제</button>
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
              <p className="text-gray-400 text-center py-12">주문이 없어요</p>
            )}
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
                    <p className="font-medium mt-0.5">{order.receiver_name} · {order.receiver_phone}</p>
                    <p className="text-xs text-gray-400">{order.receiver_address}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    {Object.entries(STATUS_LABEL).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 mb-3">
                  {order.shop_order_items.map((item: any, i: number) => (
                    <p key={i} className="text-sm text-gray-600">
                      {item.product_name} × {item.quantity} — {(item.product_price * item.quantity).toLocaleString()}원
                    </p>
                  ))}
                </div>
                <p className="font-bold text-right" style={{ color: 'var(--deep-purple)' }}>
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