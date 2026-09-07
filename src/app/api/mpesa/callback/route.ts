import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const stkCallback = body?.Body?.stkCallback

    if (!stkCallback) {
      return NextResponse.json(
        { error: 'Invalid callback payload structure.' },
        { status: 400 }
      )
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback

    // ResultCode 0 indicates successful payment by the customer
    if (ResultCode === 0) {
      // Extract M-Pesa Receipt Number from metadata items
      let mpesaReceiptNumber = ''
      if (CallbackMetadata?.Item) {
        const receiptItem = CallbackMetadata.Item.find(
          (item: any) => item.Name === 'MpesaReceiptNumber'
        )
        if (receiptItem) {
          mpesaReceiptNumber = receiptItem.Value
        }
      }

      const supabase = await createClient()

      // 1. Find and update order deposit status using CheckoutRequestID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({
          deposit_status: 'DEPOSIT_PAID',
          mpesa_receipt_number: mpesaReceiptNumber,
        })
        .eq('checkout_request_id', CheckoutRequestID)
        .select('id, product_id')
        .single()

      if (orderError || !order) {
        console.error(
          `Callback Error: Order not found for CheckoutRequestID: ${CheckoutRequestID}`,
          orderError
        )
        // Acknowledge receipt to Safaricom regardless to prevent retries
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      // 2. Mark shoe as SOLD so it disappears from the available catalog
      if (order.product_id) {
        const { error: productError } = await supabase
          .from('products')
          .update({ status: 'SOLD' })
          .eq('id', order.product_id)

        if (productError) {
          console.error(
            `Callback Error: Failed to set product ${order.product_id} to SOLD`,
            productError
          )
        }
      }
    } else {
      console.warn(
        `STK Push failed for CheckoutRequestID ${CheckoutRequestID}: ${ResultDesc} (Code ${ResultCode})`
      )

      const supabase = await createClient()
      await supabase
        .from('orders')
        .update({ deposit_status: 'FAILED' })
        .eq('checkout_request_id', CheckoutRequestID)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err: any) {
    console.error('Callback Route Error:', err)
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: 'Internal Server Error' },
      { status: 500 }
    )
  }
}