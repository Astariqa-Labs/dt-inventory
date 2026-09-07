import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOutCustomer } from '@/app/account/actions'

export default async function CustomerHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        <Link href="/products" className="font-display font-black text-xl uppercase tracking-tight text-stone-900">
          Kicks Vault
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition"
          >
            Catalog
          </Link>

          {user ? (
            <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                {user.email}
              </span>
              <form action={signOutCustomer}>
                <button
                  type="submit"
                  className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/account/login"
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}