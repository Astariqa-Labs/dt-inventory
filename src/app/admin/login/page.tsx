'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    // 1. Authenticate credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Failed to retrieve user instance.')
      setLoading(false)
      return
    }

    // 2. Fetch role and catch database/RLS errors explicitly
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileError) {
      await supabase.auth.signOut()
      setError('Database error validating permissions. Please verify RLS policies.')
      setLoading(false)
      return
    }

    // 3. Verify Admin privilege
    if (!profile || profile.role !== 'ADMIN') {
      await supabase.auth.signOut()
      setError('Access restricted. Admin credentials required.')
      setLoading(false)
      return
    }

    // 4. Force hard client sync to ensure Server Components receive the auth cookie
    router.replace('/admin/inventory')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-900">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Admin Vault
          </span>
          <h1 className="font-display font-black text-2xl uppercase tracking-tight text-stone-900 pt-2">
            Staff Sign In
          </h1>
          <p className="text-xs text-stone-500">
            Authenticate to manage inventory and view customer orders.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl transition shadow-sm cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Enter Admin Vault'}
          </button>
        </form>
      </div>
    </main>
  )
}