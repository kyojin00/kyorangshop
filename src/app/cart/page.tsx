import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import CartClient from '@/components/CartClient'

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: cartItems } = await supabase
    .from('shop_carts')
    .select(`
      id,
      quantity,
      product:shop_products (
        id, name, price, images, stock
      )
    `)
    .eq('user_id', user.id)

  const items = (cartItems ?? []).map(item => ({
    ...item,
    product: Array.isArray(item.product) ? item.product[0] : item.product,
  }))

  return (
    <>
      <Nav />
      <CartClient cartItems={items as any} />
    </>
  )
}