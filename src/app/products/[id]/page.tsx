import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductDetailGallery from './ProductDetailGallery'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Unwrap the params promise introduced in Next.js 15
  const { id } = await params

  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(numericPrice)

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <Link href="/products" className="hover:text-amber-700 transition">
            ← Back to All Shoes
          </Link>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Gallery Component */}
          <div className="md:col-span-7">
            <ProductDetailGallery product={product} />
          </div>

          {/* Purchase Details */}
          <div className="md:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="space-y-1.5 border-b border-stone-100 pb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                UK {product.size}
              </span>
              <h1 className="font-display font-black text-2xl uppercase text-stone-900">
                {product.title}
              </h1>
              <p className="font-mono font-black text-amber-700 text-xl">
                {formattedPrice}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-bold text-stone-500 uppercase">Condition</span>
                <span className="font-semibold text-stone-900">{product.condition.replace('_', ' ')}</span>
              </div>
              {product.color && (
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="font-bold text-stone-500 uppercase">Colorway</span>
                  <span className="font-semibold text-stone-900">{product.color}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Description & Sourcing Notes
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description || 'Authentic hand-sourced thrift pair. Cleaned and prepared for dispatch.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}