'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number | string
  size: string
}

export default function CheckoutModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const [isGuest, setIsGuest] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  async function handleGuestPayment(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatusMessage('Initiating guest checkout...')

    try {
      // 1. Create Guest Order
      const orderRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          phone,
          address,
          isGuest: true,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to place order.')

      // 2. Trigger M-Pesa STK Push
      setStatusMessage('Sending M-Pesa payment prompt to your phone...')
      const stkRes = await fetch('/api/payments/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: product.price,
          orderId: orderData.orderId,
        }),
      })

      const stkData = await stkRes.json()
      if (stkData.ResponseCode === '0') {
        setStatusMessage('PIN prompt sent! Complete payment on your phone.')
      } else {
        setStatusMessage('Could not trigger M-Pesa prompt. Please verify phone number.')
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-sm font-bold"
        >
          ✕
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Checkout
          </span>
          <h2 className="font-display font-black text-xl uppercase text-stone-900">
            {product.title} (UK {product.size})
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            Total: KES {Number(product.price).toLocaleString()}
          </p>
        </div>

        {!isGuest ? (
          /* Choice Screen */
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsGuest(true)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              Express Guest Checkout
            </button>

            <div className="relative flex items-center justify-center my-2">
              <span className="absolute bg-white px-2 text-[10px] uppercase font-bold text-stone-400">
                Or
              </span>
              <div className="w-full border-t border-stone-200"></div>
            </div>

            <Link
              href={`/auth/login?redirect=/products/${product.id}`}
              className="block text-center w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 font-extrabold rounded-xl text-xs uppercase tracking-wider transition"
            >
              Sign In to Track Orders
            </Link>
          </div>
        ) : (
          /* Express Guest Form */
          <form onSubmit={handleGuestPayment} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Delivery Location
              </label>
              <textarea
                required
                rows={2}
                placeholder="Estate, building, or landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
              />
            </div>

            {statusMessage && (
              <p className="text-xs font-mono text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                ● {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              {submitting ? 'Processing...' : 'Pay via M-Pesa'}
            </button>

            <button
              type="button"
              onClick={() => setIsGuest(false)}
              className="w-full text-center text-xs font-bold text-stone-500 hover:underline"
            >
              ← Back to options
            </button>
          </form>
        )}
      </div>
    </div>
  )
}