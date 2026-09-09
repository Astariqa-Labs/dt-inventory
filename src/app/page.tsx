import Footer from '@/components/Footer'
import Link from 'next/link'
import { Footprints, Palette, ShieldCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="relative bg-stone-900 text-stone-100 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
            Deuteronomy Shop • Village Thrift & Restoration
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            Step Into Comfort. <br />
            <span className="text-amber-600">Own Authentic Clarks.</span>
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Handpicked second-hand Clarks sourced directly from local village markets. Comfort, class, and timeless suede restored to perfection.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-sm transition shadow-md"
            >
              Shop Thrift Collection
            </Link>
            <Link
              href="/services/dye"
              className="px-6 py-3 border border-stone-700 hover:bg-stone-800 text-stone-200 font-bold rounded-lg text-sm transition"
            >
              Dye Your Suede
            </Link>
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

        {/* Hand-Picked Quality (Replaced Admin Card) */}
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