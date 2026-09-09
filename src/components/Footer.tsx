import Link from 'next/link'
import { Phone, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-auto py-12 px-6 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Brand Section */}
        <div className="max-w-xs">
          <p className="font-display font-extrabold uppercase text-stone-100 text-sm tracking-tight">
            Deuteronomy<span className="text-amber-500">.</span>
          </p>
          <p className="mt-1 text-stone-400">Curated village thrift & professional suede restoration.</p>
        </div>

        {/* Customer Care Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-y md:border-y-0 border-stone-800 py-4 md:py-0 w-full md:w-auto">
          <span className="text-stone-300 font-bold uppercase tracking-wider text-[11px]">
            Customer Support:
          </span>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Phone */}
            <a 
              href="tel:+254780172385" 
              className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>+254 780 172 385</span>
            </a>

            {/* Email */}
            <a 
              href="mailto:dtshop.support@gmail.com" 
              className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>dtshop.support@gmail.com</span>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/+254 780 172 385" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-stone-500 shrink-0">
          <p>© {new Date().getFullYear()} Powered By Astariqa Labs. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}