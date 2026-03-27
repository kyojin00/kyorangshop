import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import OrderDetailClient from '@/components/OrderDetailClient'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('shop_orders')
    .select(`
      id, status, total_amount, created_at,
      receiver_name, receiver_phone, receiver_address, receiver_address_detail,
      toss_order_id,
      shop_order_items (
        id, product_name, product_price, quantity, product_id
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) notFound()

  return (
    <>
      <Nav />
      <OrderDetailClient order={order} />
    </>
  )
}