import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('shop_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Nav />
      <HomeClient products={products ?? []} />
    </>
  )
}