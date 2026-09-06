import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const supabase = await createClient()

    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const itemType = formData.get('itemType') as 'THRIFT_SHOES' | 'SUEDE_DYE_SERVICE'

    // 1. Create main order entry
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([
        {
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          total_amount: itemType === 'SUEDE_DYE_SERVICE' ? 25.00 : parseFloat(formData.get('price') as string),
          payment_status: 'PAID',
          service_status: itemType === 'SUEDE_DYE_SERVICE' ? 'WAITING_FOR_PAIR' : null,
        },
      ])
      .select()
      .single()

    if (orderErr) throw orderErr

    // 2. Insert line item
    const { error: itemErr } = await supabase.from('order_items').insert([
      {
        order_id: order.id,
        type: itemType,
        product_id: itemType === 'THRIFT_SHOES' ? formData.get('productId') : null,
        dye_color: itemType === 'SUEDE_DYE_SERVICE' ? formData.get('dyeColor') : null,
        shoe_model_note: formData.get('shoeModelNote') || null,
        price: order.total_amount,
      },
    ])

    if (itemErr) throw itemErr

    // 3. Update product status if buying thrift shoe
    if (itemType === 'THRIFT_SHOES') {
      await supabase
        .from('products')
        .update({ status: 'SOLD' })
        .eq('id', formData.get('productId'))
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}