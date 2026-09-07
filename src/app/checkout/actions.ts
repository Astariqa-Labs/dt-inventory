'use server'

import { createClient } from '@/lib/supabase/server'

export async function processGuestCheckout(formData: FormData) {
  const productId = formData.get('productId') as string
  const guestEmail = formData.get('email') as string
  const phoneNumber = formData.get('phone') as string
  const shippingAddress = formData.get('address') as string

  const supabase = await createClient()

  // 1. Fetch product price
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('price, title')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    return { error: 'Product no longer available.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', guestEmail)
    .maybeSingle()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      product_id: productId,
      customer_email: guestEmail,
      phone_number: phoneNumber,
      shipping_address: shippingAddress,
      amount: product.price,
      status: 'PENDING',
      user_id: profile?.id || null, 
    })
    .select()
    .single()

  if (orderError) {
    return { error: 'Failed to create order record.' }
  }

  // 4. Initiate M-Pesa STK Push
  // ... (Call your existing Daraja STK Push endpoint passing order.id & phoneNumber)

  return { success: true, orderId: order.id }
}