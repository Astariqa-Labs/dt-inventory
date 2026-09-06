import { NextResponse } from 'next/server'
import { getMpesaToken } from '@/lib/mpesa'

export async function POST(req: Request) {
  try {
    const { phone, amount, orderId } = await req.json()

    // Format phone to 254XXXXXXXXX
    let formattedPhone = phone.replace(/\+/g, '').trim()
    if (formattedPhone.startsWith('0')) {
      formattedPhone = `254${formattedPhone.slice(1)}`
    }

    const token = await getMpesaToken()
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    
    // Generate Timestamp (YYYYMMDDHHmmss)
    const date = new Date()
    const timestamp = date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0') +
      String(date.getSeconds()).padStart(2, '0')

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.MPESA_CALLBACK_URL}?orderId=${orderId}`,
      AccountReference: 'ClarksThrift',
      TransactionDesc: `Order #${orderId.slice(0, 8)}`,
    }

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}