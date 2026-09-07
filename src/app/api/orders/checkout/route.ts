import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      productId,
      phone,
      email,
      address,
      depositAmount,
      balanceDue,
      userId,
    } = body

    if (!productId || !phone || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, address, or product.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Verify product availability
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, status')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    if (product.status === 'SOLD') {
      return NextResponse.json({ error: 'Sorry, this pair is already sold!' }, { status: 400 })
    }

    const fullPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const computedDeposit = depositAmount || Math.ceil(fullPrice / 2)
    const computedBalance = balanceDue || (fullPrice - computedDeposit)
    const resolvedEmail = email || `guest_${Date.now()}@mconnect.local`

    // 2. Save order linked to user_id if logged in, or null if guest
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        product_id: productId,
        user_id: userId || null,
        phone_number: phone,
        customer_phone: phone,
        customer_email: resolvedEmail,
        shipping_address: address,
        total_amount: fullPrice,
        deposit_amount: computedDeposit,
        balance_due: computedBalance,
        deposit_status: 'PENDING',
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Supabase Order Insert Error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      depositAmount: computedDeposit,
      balanceDue: computedBalance,
    })
  } catch (err: any) {
    console.error('Checkout API Route Error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}