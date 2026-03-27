import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import MypageClient from '@/components/MypageClient'

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: orders },
    { data: points },
    { count: cartCount },
  ] = await Promise.all([
    supabase
      .from('shop_orders')
      .select(`
        id, status, total_amount, created_at,
        shop_order_items ( product_name, quantity, product_price )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('shop_points')
      .select('amount, reason, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('shop_carts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const totalPoints = (points ?? []).reduce((sum, p) => sum + p.amount, 0)
  const shippingOrders = (orders ?? []).filter(o => o.status === 'shipping')
  const paidOrders = (orders ?? []).filter(o => o.status === 'paid')

  return (
    <>
      <Nav />
      <MypageClient
        email={user.email ?? ''}
        totalPoints={totalPoints}
        orders={orders ?? []}
        points={points ?? []}
        cartCount={cartCount ?? 0}
        shippingCount={shippingOrders.length}
        paidCount={paidOrders.length}
      />
    </>
  )
}