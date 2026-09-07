'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAdmin } from '@/app/admin/actions'

export default function AdminHeader() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Orders', href: '/admin/orders' },
  ]

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Admin Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="font-display font-black text-lg uppercase tracking-tight text-stone-900 hover:text-amber-700 transition"
          >
            Vault Admin
          </Link>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
            Internal
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout Action */}
        <div>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            >
              Log Out
            </button>
          </form>
        </div>

      </div>
    </header>
  )
}