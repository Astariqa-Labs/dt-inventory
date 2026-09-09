import { createClient } from '@/lib/supabase/server'
import ProductCard from './ProductCard'
import Link from 'next/link'

export const revalidate = 0

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })

  const totalCount = products?.length || 0
  const availableCount = products?.filter((p) => p.status === 'AVAILABLE').length || 0

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Village Thrift
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {availableCount} Available • {totalCount} Total Drops
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight uppercase text-stone-900">
              Curated Clarks Collection
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Handpicked second-hand Clarks sourced directly from local village markets. Each pair is authenticated, cleaned, and restored before listing.
            </p>
          </div>

          {/* Exclusive Sourcing Action */}
          <div className="flex items-center gap-3 bg-white border border-stone-200 p-2 rounded-2xl shadow-sm shrink-0">
            <a
              href="https://wa.me/254780172385?text=Hi%20Deuteronomy,%20I'm%20looking%20for%20a%20specific%20Clarks%20size/model%20from%20the%20next%20village%20drop."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              Request Your Size →
            </a>
          </div>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-16">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-xl mx-auto">
              👞
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-stone-900 uppercase tracking-tight">
                No Pairs Listed Right Now
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                Our fresh batch of village finds is being authenticated. Check back soon or restore your existing pair.
              </p>
            </div>
            <Link
              href="/services/dye"
              className="inline-block px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
            >
              Book Suede Dye Service
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}