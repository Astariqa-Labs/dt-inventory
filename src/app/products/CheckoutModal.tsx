'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  title: string
  price: number | string
  size: string
}

type Mode = 'CHOICE' | 'GUEST' | 'LOGIN' | 'SIGNUP' | 'AUTHENTICATED'

export default function CheckoutModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const supabase = createClient()

  const [mode, setMode] = useState<Mode>('CHOICE')
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Form Fields
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')

  // State flags
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fullPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const depositAmount = Math.ceil(fullPrice / 2)
  const balanceDue = fullPrice - depositAmount

  // Helper to format Kenya phone numbers to standard 254 Format
  const formatPhoneNumber = (input: string) => {
    let cleaned = input.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1)
    }
    return cleaned
  }

  // 1. Check if client is already logged in on mount
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
        setEmail(user.email || '')
        setMode('AUTHENTICATED')
      }
    }
    checkUser()
  }, [])

  // 2. Handle Auth (Login / Sign Up / Guest)
  async function handleAuth() {
    if (mode === 'GUEST' || mode === 'AUTHENTICATED') {
      return currentUser
    }

    if (mode === 'LOGIN') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      return data.user
    } 

    if (mode === 'SIGNUP') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { phone: formatPhoneNumber(phone) } },
      })
      if (error) throw new Error(error.message)

      // Fallback if testing with an unconfirmed legacy account created prior to setting change
      if (data.user && !data.session) {
        throw new Error('This email account is still unconfirmed from a previous signup. Please confirm it in Supabase or use a new email.')
      }

      return data.user
    }

    return null
  }

  // 3. Complete Checkout & Send M-Pesa STK Push
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatusMsg('Processing...')

    try {
      let activeUser = currentUser
      const formattedPhone = formatPhoneNumber(phone)

      // Execute Auth step if creating account or logging in
      if (mode === 'LOGIN' || mode === 'SIGNUP') {
        setStatusMsg(mode === 'LOGIN' ? 'Logging in...' : 'Creating account...')
        activeUser = await handleAuth()
        setCurrentUser(activeUser)
      }

      // Step A: Create Order
      setStatusMsg('Creating order...')
      const orderRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          phone: formattedPhone,
          email: activeUser?.email || email,
          address,
          depositAmount,
          balanceDue,
          userId: activeUser?.id || null,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to place order.')

      // Step B: Trigger M-Pesa STK Push
      setStatusMsg(`Triggering M-Pesa prompt for KES ${depositAmount.toLocaleString()}...`)
      const stkRes = await fetch('/api/payments/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: depositAmount,
          orderId: orderData.orderId,
        }),
      })

      const stkData = await stkRes.json()
      if (stkData.ResponseCode === '0' || stkData.CheckoutRequestID) {
        setStatusMsg('PIN prompt sent! Complete deposit on your phone.')
      } else {
        setStatusMsg('Could not trigger payment. Please verify phone number.')
      }
    } catch (err: any) {
      console.error(err)
      setStatusMsg(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-sm font-bold"
        >
          ✕
        </button>

        {/* Order Brief Header */}
        <div className="border-b border-stone-100 pb-4 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            50% Commitment Deposit
          </span>
          <h2 className="font-display font-black text-xl uppercase text-stone-900 leading-tight">
            {product.title} (UK {product.size})
          </h2>
          <div className="flex justify-between items-center text-xs text-stone-500 pt-1">
            <span>Deposit: <strong className="text-stone-900 font-mono">KES {depositAmount.toLocaleString()}</strong></span>
            <span>Balance on Delivery: <strong className="text-stone-900 font-mono">KES {balanceDue.toLocaleString()}</strong></span>
          </div>
        </div>

        {mode === 'CHOICE' && (
          <div className="space-y-3 pt-1">
            <button
              onClick={() => setMode('GUEST')}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Express Guest Checkout (Fastest)
            </button>

            <div className="relative flex items-center justify-center my-3">
              <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Or Continue With Account
              </span>
              <div className="w-full border-t border-stone-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('LOGIN')}
                className="py-3 bg-stone-900 hover:bg-stone-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => setMode('SIGNUP')}
                className="py-3 border border-stone-300 hover:bg-stone-50 text-stone-800 font-extrabold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: FORM INPUTS */}
        {mode !== 'CHOICE' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Header Badge */}
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {mode === 'GUEST' && 'Guest Checkout'}
              {mode === 'LOGIN' && 'Log In & Order'}
              {mode === 'SIGNUP' && 'Create Account & Order'}
              {mode === 'AUTHENTICATED' && `Logged in as ${currentUser?.email}`}
            </div>

            {/* Email Field */}
            {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'GUEST') && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address {mode === 'GUEST' && '(Optional)'}
                </label>
                <input
                  type="email"
                  required={mode !== 'GUEST'}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900"
                />
              </div>
            )}

            {/* Password Field */}
            {(mode === 'LOGIN' || mode === 'SIGNUP') && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900"
                />
              </div>
            )}

            {/* M-Pesa Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="0712345678 or 254712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:border-amber-600 text-stone-900"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Delivery Address / Drop-off Point
              </label>
              <textarea
                required
                rows={2}
                placeholder="Estate, street, building, or landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900 resize-none"
              />
            </div>

            {/* Status Feedback */}
            {statusMsg && (
              <p className="text-xs font-mono text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                ● {statusMsg}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              {loading ? 'Processing...' : `Pay KES ${depositAmount.toLocaleString()} Deposit`}
            </button>

            {/* Switch Mode / Back Button */}
            {!currentUser && (
              <button
                type="button"
                onClick={() => setMode('CHOICE')}
                className="w-full text-center text-[11px] font-bold text-stone-400 hover:text-stone-700 pt-1"
              >
                ← Choose another checkout option
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}