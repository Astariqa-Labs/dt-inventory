'use client'

import { useState } from 'react'

const DYE_COLORS = [
  { id: 'NAVY_BLUE', name: 'Navy Blue', hex: '#1B263B' },
  { id: 'FOREST_GREEN', name: 'Forest Green', hex: '#2D4A3E' },
  { id: 'ESPRESSO_BROWN', name: 'Espresso Brown', hex: '#3D2314' },
  { id: 'MIDNIGHT_BLACK', name: 'Midnight Black', hex: '#111111' },
  { id: 'CHARCOAL_GREY', name: 'Charcoal Grey', hex: '#333333' },
]

const FIXED_SERVICE_AMOUNT = 3250 // KES

export default function SuedeDyeServicePage() {
  const [selectedColor, setSelectedColor] = useState('NAVY_BLUE')
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  async function handleCheckoutAndPay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setStatusMessage('Creating service order...')

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('dyeColor', selectedColor)
    formData.set('itemType', 'SUEDE_DYE_SERVICE')

    try {
      // 1. Create order record in Supabase
      const orderRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        body: formData,
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order.')
      }

      // 2. Trigger M-Pesa STK Push
      setStatusMessage('Sending M-Pesa payment prompt to your phone...')

      const phone = formData.get('phone') as string
      const stkRes = await fetch('/api/payments/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: FIXED_SERVICE_AMOUNT,
          orderId: orderData.orderId,
        }),
      })

      const stkData = await stkRes.json()

      if (stkData.ResponseCode === '0') {
        setStatusMessage('PIN prompt sent! Check your phone to complete payment.')
        form.reset()
      } else {
        setStatusMessage('Could not trigger M-Pesa. Please check your phone number.')
      }
    } catch (err: any) {
      console.error(err)
      setStatusMessage(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Restoration Workshop
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Turnaround: 3–5 Days
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight uppercase text-stone-900">
              Suede Color Renewal
            </h1>
            <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
              Professional deep-dyeing, brush treatment, and texture restoration for faded Clarks Wallabees or Desert Boots. Select your target shade and submit delivery details.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleCheckoutAndPay} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          
          {/* Shoe Model Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Shoe Model & Current Color
            </label>
            <input
              name="shoeModelNote"
              type="text"
              required
              placeholder="e.g., Clarks Wallabee - Tan Suede"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900 placeholder-stone-400 transition"
            />
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Target Dye Shade
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DYE_COLORS.map((color) => {
                const isSelected = selectedColor === color.id
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-bold tracking-wide">{color.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contact & Payment Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900 placeholder-stone-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="0712345678 or 254712345678"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900 placeholder-stone-400 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Return Delivery Address / Drop-off Location
              </label>
              <textarea
                name="address"
                required
                rows={2}
                placeholder="Estate, street, building, or landmark in Nairobi"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900 placeholder-stone-400 transition"
              />
            </div>
          </div>

          {/* Status Feedback Banner */}
          {statusMessage && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono text-amber-900 flex items-center gap-2">
              <span className="animate-pulse text-amber-600">●</span>
              <span className="font-semibold">{statusMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold uppercase tracking-wider rounded-xl transition text-xs shadow-md cursor-pointer active:scale-[0.99]"
          >
            {submitting ? 'Processing Order...' : `Pay via M-Pesa — KES ${FIXED_SERVICE_AMOUNT.toLocaleString()}`}
          </button>
        </form>

      </div>
    </main>
  )
}