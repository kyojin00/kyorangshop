import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import ProductDetailClient from '@/components/ProductDetailClient'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Nav />
      <ProductDetailClient product={product} userId={user?.id ?? null} />
    </>
  )
}