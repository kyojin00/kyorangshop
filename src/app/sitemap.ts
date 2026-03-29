import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('shop_products')
    .select('id, updated_at')

  const productUrls: MetadataRoute.Sitemap = (products || []).map(p => ({
    url: `https://shop.kyorang.com/products/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://shop.kyorang.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://shop.kyorang.com/cart',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://shop.kyorang.com/orders',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://shop.kyorang.com/mypage',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...productUrls,
  ]
}