import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient, { AdminClientProps } from '@/components/AdminClient'

const ADMIN_ID = '76b9b63a-306b-4ec5-9b43-a8b4a3aef60a'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== ADMIN_ID) redirect('/')

  const { data: products } = await supabase
    .from('shop_products')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: orders } = await supabase
    .from('shop_orders')
    .select(`
      id, status, total_amount, receiver_name,
      receiver_phone, receiver_address, created_at,
      shop_order_items (
        product_name, quantity, product_price
      )
    `)
    .order('created_at', { ascending: false })

  const props: AdminClientProps = {
    products: products ?? [],
    orders: orders ?? [],
  }

  return <AdminClient {...props} />
}