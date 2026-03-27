import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const { item_name, quantity, total_amount, form, cartItems } = await req.json()

  // 주문 생성
  const { data: order, error: orderError } = await supabase
    .from('shop_orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      total_amount,
      receiver_name: form.receiver_name,
      receiver_phone: form.receiver_phone,
      receiver_address: form.receiver_address,
      receiver_address_detail: form.receiver_address_detail,
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: '주문 생성 실패' }, { status: 500 })
  }

  // 주문 상품 생성
  await supabase.from('shop_order_items').insert(
    cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_price: item.product.price,
      quantity: item.quantity,
    }))
  )

  // 카카오페이 준비 요청
  const kakaoRes = await fetch('https://open-api.kakaopay.com/online/v1/payment/ready', {
    method: 'POST',
    headers: {
      'Authorization': `SECRET_KEY ${process.env.KAKAO_SECRET_KEY_DEV}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: 'TC0ONETIME',
      partner_order_id: order.id,
      partner_user_id: user.id,
      item_name,
      quantity,
      total_amount,
      tax_free_amount: 0,
      approval_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      fail_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/fail`,
    }),
  })

  const kakaoData = await kakaoRes.json()

  if (!kakaoRes.ok) {
    return NextResponse.json({ error: kakaoData.msg ?? '카카오페이 오류' }, { status: 500 })
  }

  // tid 저장
  await supabase
    .from('shop_orders')
    .update({ toss_order_id: kakaoData.tid })
    .eq('id', order.id)

  return NextResponse.json({ next_redirect_pc_url: kakaoData.next_redirect_pc_url })
}