import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1)
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned
  }
  return cleaned
}

export async function POST(req: Request) {
  try {
    const { phone, amount, orderId } = await req.json()

    if (!phone || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing phone, amount, or orderId.' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phone)

    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    const passkey = process.env.MPESA_PASSKEY
    const shortcode = process.env.MPESA_SHORTCODE
    const callbackUrl = process.env.MPESA_CALLBACK_URL

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      return NextResponse.json(
        { error: 'M-Pesa environment variables are missing in .env.local.' },
        { status: 500 }
      )
    }

    // Toggle between sandbox and production endpoint based on environment
    const baseUrl = process.env.MPESA_ENV === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke'

    // 1. Fetch OAuth Access Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
    const tokenRes = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
        cache: 'no-store',
      }
    )

    // Handle non-JSON or HTTP error responses safely
    if (!tokenRes.ok) {
      const errorText = await tokenRes.text()
      console.error('Safaricom OAuth HTTP Error:', tokenRes.status, errorText)
      return NextResponse.json(
        { error: `Safaricom OAuth failed (${tokenRes.status}). Check Consumer Key/Secret.` },
        { status: 401 }
      )
    }

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to retrieve access_token from Safaricom.' },
        { status: 500 }
      )
    }

    // 2. Generate Timestamp & Password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)

    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString('base64')

    // 3. Send STK Push
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(Number(amount)),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: orderId,
      TransactionDesc: `Deposit for Order ${orderId}`,
    }

    const stkRes = await fetch(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPayload),
        cache: 'no-store',
      }
    )

    const stkData = await stkRes.json()

    if (stkData.ResponseCode !== '0') {
      return NextResponse.json(
        { error: stkData.CustomerMessage || 'STK push failed.' },
        { status: 400 }
      )
    }

    // 4. Save CheckoutRequestID in Supabase
    const supabase = await createClient()
    await supabase
      .from('orders')
      .update({ checkout_request_id: stkData.CheckoutRequestID })
      .eq('id', orderId)

    return NextResponse.json(stkData)
  } catch (err: any) {
    console.error('STK Push Server Error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to trigger payment.' },
      { status: 500 }
    )
  }
}