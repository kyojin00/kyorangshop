import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const { order_id } = await req.json()

  const { data: order } = await supabase
    .from('shop_orders')
    .select('id, status, user_id')
    .eq('id', order_id)
    .single()

  if (!order) return NextResponse.json({ error: '주문 없음' }, { status: 404 })
  if (order.user_id !== user.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  if (order.status !== 'pending') return NextResponse.json({ error: '결제 대기 주문만 취소 가능해요' }, { status: 400 })

  await supabase
    .from('shop_orders')
    .update({ status: 'cancelled' })
    .eq('id', order_id)

  return NextResponse.json({ success: true })
}