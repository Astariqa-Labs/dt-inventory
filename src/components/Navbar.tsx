'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { name: 'Thrift Shoes', href: '/products' },
    { name: 'Suede Dye Service', href: '/services/dye' },
  ]

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand Mark & Logo */}
        <Link href="/" className="flex items-center space-x-3.5 group">
          <div className="relative w-10 h-10 bg-stone-900 text-stone-100 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-amber-700 transition duration-200">
            <svg
              className="w-5 h-5 text-amber-500 group-hover:text-stone-100 transition duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" opacity="0.15" fill="currentColor" />
              <path d="M8 7h5a4 4 0 0 1 0 8H8V7z" />
              <path d="M8 19c4 0 8-1.5 10-3" className="stroke-amber-400" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-tight uppercase text-stone-900 leading-none">
              Deutronomy<span className="text-amber-700">.</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-stone-500 uppercase mt-1">
              Clarks Thrift & Suede
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="flex items-center space-x-6 text-sm font-semibold">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive ? 'text-amber-700 font-bold' : 'text-stone-700 hover:text-amber-700'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <Link
            href="/admin/inventory"
            className="px-3.5 py-1.5 bg-stone-900 text-stone-100 rounded-lg text-xs font-bold hover:bg-stone-800 transition shadow-sm"
          >
            Admin Portal
          </Link>
        </nav>
      </div>
    </header>
  )
}