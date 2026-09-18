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
      {/* Hero Section with Background Image & Paybill Integration */}
      <section className="relative bg-stone-950 text-stone-100 py-24 px-6 overflow-hidden">
        
        {/* Background Image Container with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
            alt="Clarks Leather and Suede Shoes Background"
            fill
            priority
            className="object-cover object-center opacity-25 mix-blend-luminosity scale-105"
          />
          {/* Vignette / Gradient overlays to guarantee text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Badge */}
          <span className="inline-block text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-950/50 border border-amber-800/40 px-3.5 py-1 rounded-full backdrop-blur-sm">
            Deuteronomy Shop • Village Thrift & Restoration
          </span>

          {/* Main Headline */}
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-white drop-shadow-sm">
            Step Into Comfort. <br />
            <span className="text-amber-500">Own Authentic Clarks.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Handpicked second-hand Clarks sourced directly from local village markets. Comfort, class, and timeless suede restored to perfection.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/products"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-amber-950/40"
            >
              Shop Thrift Collection
            </Link>
            <Link
              href="/services/dye"
              className="px-6 py-3 border border-stone-700 bg-stone-900/60 hover:bg-stone-800 text-stone-200 font-bold rounded-xl text-sm transition backdrop-blur-sm"
            >
              Dye Your Suede
            </Link>
          </div>

          {/* Integrated Equity Paybill Info Card */}
          <div className="pt-6 max-w-md mx-auto">
            <div className="bg-stone-900/90 border border-stone-800/80 backdrop-blur-md rounded-2xl p-3.5 px-4 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Official Equity Paybill</p>
                  <p className="text-stone-200 font-bold">
                    Paybill: <span className="text-amber-400">247247</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-l border-stone-800 pl-3">
                <div className="text-left font-mono">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Account No</p>
                  <p className="text-amber-400 font-bold">0708223674</p>
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy Account Number"
                  className="p-1.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition ml-1"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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