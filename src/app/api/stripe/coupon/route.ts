import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 })

  try {
    let coupon: Stripe.Coupon | null = null
    let promoCodeId: string | null = null

    // 1. Try as a direct coupon ID
    try {
      coupon = await stripe.coupons.retrieve(id)
    } catch {
      // Not a coupon ID — fall through to promotion code lookup
    }

    // 2. Try as a promotion code (e.g. "EARLY50")
    if (!coupon) {
      const promoCodes = await stripe.promotionCodes.list({
        code: id,
        limit: 1,
        expand: ['data.coupon'],
      })
      if (promoCodes.data.length > 0) {
        const promo = promoCodes.data[0]
        promoCodeId = promo.id
        // coupon is expanded via expand: ['data.coupon'] — cast through unknown to satisfy TS
        const rawCoupon = (promo as unknown as { coupon: Stripe.Coupon | string }).coupon
        coupon = typeof rawCoupon === 'string'
          ? await stripe.coupons.retrieve(rawCoupon)
          : rawCoupon as Stripe.Coupon
      }
    }

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 404 })
    }

    return NextResponse.json({
      id: coupon.id,
      promo_code_id: promoCodeId,
      name: coupon.name,
      percent_off: coupon.percent_off ?? null,
      amount_off: coupon.amount_off ?? null,
      currency: coupon.currency ?? null,
      valid: coupon.valid,
      times_redeemed: coupon.times_redeemed,
      max_redemptions: coupon.max_redemptions ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 404 })
  }
}
