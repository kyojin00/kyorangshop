import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import CheckoutClient from '@/components/CheckoutClient'

export default async function CheckoutPage() {
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

  if (!cartItems || cartItems.length === 0) redirect('/cart')

  const items = cartItems.map(item => ({
    ...item,
    product: Array.isArray(item.product) ? item.product[0] : item.product,
  }))

  return (
    <>
      <Nav />
      <CheckoutClient cartItems={items as any} userId={user.id} />
    </>
  )
}