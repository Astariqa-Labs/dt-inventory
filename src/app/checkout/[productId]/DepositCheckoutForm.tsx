'use client'

import { useState } from 'react'

interface FormProps {
  product: any
  fullPrice: number
  depositAmount: number
  balanceDue: number
}

export default function DepositCheckoutForm({
  product,
  fullPrice,
  depositAmount,
  balanceDue,
}: FormProps) {
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleDepositCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Trigger your M-Pesa STK Push endpoint for the depositAmount
    // Example: await fetch('/api/mpesa/stkpush', { body: JSON.stringify({ phone, amount: depositAmount }) })

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="text-4xl">📱</div>
        <h2 className="font-display font-black text-xl uppercase text-stone-900">
          Check Your Phone!
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
          An M-Pesa prompt has been sent to <span className="font-mono font-bold text-stone-900">{phone}</span> to pay the 50% deposit of <span className="font-mono font-bold text-amber-700">KES {depositAmount.toLocaleString()}</span>.
        </p>
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl text-left text-xs text-stone-600 space-y-1">
          <p>• Once approved, our rider will dispatch your shoe to <strong className="text-stone-900">{address}</strong>.</p>
          <p>• You pay the remaining <strong className="text-stone-900">KES {balanceDue.toLocaleString()}</strong> upon receiving and checking the pair.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleDepositCheckout} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
      <h2 className="font-display font-black text-sm uppercase tracking-tight text-stone-900 border-b border-stone-100 pb-3">
        Delivery & M-Pesa Details
      </h2>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0712345678"
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:border-amber-600"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
          Delivery Address / Area
        </label>
        <textarea
          required
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Roysambu, TRM Drive, Apartment / House No."
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
      >
        {loading
          ? 'Sending M-Pesa Prompt...'
          : `Pay KES ${depositAmount.toLocaleString()} Deposit via M-Pesa`}
      </button>

      <p className="text-[10px] text-center text-stone-400 font-medium">
        Balance of KES {balanceDue.toLocaleString()} is paid directly to the rider upon delivery.
      </p>
    </form>
  )
}