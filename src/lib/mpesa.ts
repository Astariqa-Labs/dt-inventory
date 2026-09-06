export async function getMpesaToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const res = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: 'no-store',
  })

  const data = await res.json()
  return data.access_token
}