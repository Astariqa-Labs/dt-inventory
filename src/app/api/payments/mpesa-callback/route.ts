import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    const body = await req.json()

    const resultCode = body.Body.stkCallback.ResultCode

    if (resultCode === 0 && orderId) {
      // Payment Successful
      const supabase = await createClient()

      await supabase
        .from('orders')
        .update({ payment_status: 'PAID' })
        .eq('id', orderId)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}