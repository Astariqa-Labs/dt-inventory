'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAdmin } from '@/app/admin/actions'
import { LogOut, Package, ShoppingBag } from 'lucide-react'

export default function AdminHeader() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Inventory', href: '/admin/inventory', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ]

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Brand / Admin Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/admin/inventory"
            className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-stone-900 hover:text-amber-700 transition"
          >
            Vault Admin
          </Link>
          <span className="hidden xs:inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            Internal
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Action */}
        <div className="shrink-0">
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </form>
        </div>

      </div>
    </header>
  )
}