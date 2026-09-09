import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      productId,
      itemType,
      phone,
      email,
      address,
      totalAmount,
      depositAmount,
      balanceDue,
      userId,
      shoeModelNote,
      dyeColor,
    } = body

    // 1. Validate required contact and delivery fields
    if (!phone || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: phone or address.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    let fullPrice = 0
    let targetProductId = productId || null

    // 2. Handle physical inventory lookup vs. custom service order
    if (itemType === 'SUEDE_DYE_SERVICE') {
      fullPrice = totalAmount || 3250
    } else {
      if (!productId) {
        return NextResponse.json(
          { error: 'Missing required field: productId.' },
          { status: 400 }
        )
      }

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

      fullPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    }

    const computedDeposit = depositAmount || Math.ceil(fullPrice / 2)
    const computedBalance = balanceDue || (fullPrice - computedDeposit)
    const resolvedEmail = email || `guest_${Date.now()}@mconnect.local`

    // 3. Save order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        product_id: targetProductId,
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