import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import OrdersClient, { OrdersClientProps } from '@/components/OrdersClient'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('shop_orders')
    .select(`
      id,
      status,
      total_amount,
      receiver_name,
      receiver_address,
      created_at,
      shop_order_items (
        id,
        product_name,
        product_price,
        quantity
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const props: OrdersClientProps = { orders: orders ?? [] }

  return (
    <>
      <Nav />
      <OrdersClient {...props} />
    </>
  )
}