import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const { pg_token, order_id } = await req.json()

  // tid 조회
  const { data: order } = await supabase
    .from('shop_orders')
    .select('toss_order_id, total_amount')
    .eq('id', order_id)
    .single()

  if (!order) return NextResponse.json({ error: '주문 없음' }, { status: 404 })

  // 카카오페이 승인
  const kakaoRes = await fetch('https://open-api.kakaopay.com/online/v1/payment/approve', {
    method: 'POST',
    headers: {
      'Authorization': `SECRET_KEY ${process.env.KAKAO_SECRET_KEY_DEV}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: 'TC0ONETIME',
      tid: order.toss_order_id,
      partner_order_id: order_id,
      partner_user_id: user.id,
      pg_token,
    }),
  })

  const kakaoData = await kakaoRes.json()

  if (!kakaoRes.ok) {
    return NextResponse.json({ error: kakaoData.msg ?? '승인 실패' }, { status: 500 })
  }

  // 주문 상태 업데이트 + 장바구니 비우기
  await supabase
    .from('shop_orders')
    .update({ status: 'paid', toss_payment_key: kakaoData.payment_method_type })
    .eq('id', order_id)

  await supabase.from('shop_carts').delete().eq('user_id', user.id)

  return NextResponse.json({ success: true })
}