'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Footprints, Palette, ShieldCheck, Copy, Check, CreditCard } from 'lucide-react'

export default function HomePage() {
  const [copiedAccount, setCopiedAccount] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('0708223674')
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  return (
    <div className="bg-stone-50 text-stone-900">
      {/* Hero Section with Local Clarks Background Image & Paybill Integration */}
      <section className="relative bg-stone-950 text-stone-100 py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden">
        
        {/* Background Image Container referencing Local Asset */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/clarks-hero.jpeg" // Local image stored in public/images/clarks-hero.jpg
            alt="Clarks Genuine Suede Shoes Background"
            fill
            priority
            className="object-cover object-center opacity-30 sm:opacity-25 contrast-110 saturate-90 scale-105"
          />
          {/* Dual Gradient Overlay to Ensure High Contrast and Text Readability on Mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/80 to-stone-950" />
          <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          
          {/* Top Badge */}
          <div>
            <span className="inline-block text-[10px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase bg-stone-900/90 border border-amber-900/40 px-3.5 py-1 rounded-full shadow-sm backdrop-blur-md">
              Deuteronomy Shop • Village Thrift & Restoration
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-tight sm:leading-none text-white drop-shadow-sm">
            Step Into Comfort. <br />
            <span className="text-amber-500">Own Authentic Clarks.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed px-2">
            Handpicked second-hand Clarks sourced directly from local village markets. Comfort, class, and timeless suede restored to perfection.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-950/50 text-center"
            >
              Buy Here
            </Link>
            <Link
              href="/services/dye"
              className="w-full sm:w-auto px-6 py-3.5 border border-stone-800 bg-stone-900/80 hover:bg-stone-800 active:scale-[0.98] text-stone-200 font-bold rounded-xl text-xs sm:text-sm transition backdrop-blur-sm text-center"
            >
              Dye Your Suede
            </Link>
          </div>

          {/* Integrated Equity Paybill Info Card */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="bg-stone-900/90 border border-stone-800/80 backdrop-blur-md rounded-2xl p-3 px-3.5 text-xs flex items-center justify-between gap-2 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-left font-mono leading-tight">
                  <p className="text-[9px] text-stone-400 uppercase tracking-wider font-bold">Official Equity Paybill</p>
                  <p className="text-stone-200 font-bold text-xs sm:text-sm">
                    Paybill: <span className="text-amber-400">247247</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-l border-stone-800 pl-2.5">
                <div className="text-left font-mono leading-tight">
                  <p className="text-[9px] text-stone-400 uppercase tracking-wider font-bold">Account No</p>
                  <p className="text-amber-400 font-bold text-xs sm:text-sm">0708223674</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy Account Number"
                  className="p-1.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 active:bg-amber-800 rounded-lg transition"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Curated Thrift */}
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-lg flex items-center justify-center">
            <Footprints className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-display font-bold text-lg uppercase tracking-tight">Clarks Kenya</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Unique, single-pair finds checked for genuine suede, solid soles, and original craftsmanship.
          </p>
          <Link href="/products" className="inline-block text-xs font-bold text-amber-700 hover:underline">
            Browse Inventory →
          </Link>
        </div>

        {/* Suede Dye Renewal */}
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-display font-bold text-lg uppercase tracking-tight">Suede Dye Renewal</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Give faded Wallabees or Desert Boots a fresh look with deep navy, forest green, or midnight black dye.
          </p>
          <Link href="/services/dye" className="inline-block text-xs font-bold text-amber-700 hover:underline">
            Book Dye Service →
          </Link>
        </div>

        {/* Hand-Picked Quality */}
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-display font-bold text-lg uppercase tracking-tight">Hand-Picked Quality</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every pair is individually inspected for genuine crepe soles, pristine suede texture, and structural integrity.
          </p>
          <Link
            href="https://www.youtube.com/@deuteronomyshop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-bold text-amber-700 hover:underline"
          >
            Watch Restorations on YouTube →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}