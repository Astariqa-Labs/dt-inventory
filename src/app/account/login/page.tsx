'use client'

import { useState } from 'react'
import { loginCustomer, signUpCustomer } from '@/app/account/actions'
import Link from 'next/link'

export default function CustomerAuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const action = mode === 'login' ? loginCustomer : signUpCustomer
    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-900">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-amber-700 hover:underline">
            ← Back to Store
          </Link>
          <h1 className="font-display font-black text-2xl uppercase tracking-tight text-stone-900 pt-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === 'login'
              ? 'Sign in to view your orders and saved checkout details.'
              : 'Join to track orders and enjoy faster checkout.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null) }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null) }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Dynamic Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="e.g. Dennis Shakava"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl transition shadow-sm cursor-pointer"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

      </div>
    </main>
  )
}