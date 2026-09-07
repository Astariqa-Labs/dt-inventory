import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DepositCheckoutForm from './DepositCheckoutForm'

export default async function DepositCheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product || product.status === 'SOLD') {
    notFound()
  }

  const fullPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const depositAmount = Math.ceil(fullPrice / 2)
  const balanceDue = fullPrice - depositAmount

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <Link href={`/products/${product.id}`} className="text-xs font-bold text-stone-500 hover:text-amber-700 transition">
            ← Back to Shoe
          </Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            50% Pay-On-Delivery Option
          </span>
        </div>

        {/* Selected Shoe Summary Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="relative aspect-square w-20 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">👞</div>
            )}
          </div>
          
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-start">
              <h1 className="font-display font-black text-sm uppercase text-stone-900">
                {product.title}
              </h1>
              <span className="text-[10px] font-extrabold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                UK {product.size}
              </span>
            </div>
            
            {/* Price Breakdown */}
            <div className="pt-1 text-xs space-y-0.5 font-mono">
              <div className="flex justify-between text-stone-500">
                <span>Total Price:</span>
                <span>KES {fullPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Pay Now (50% Deposit):</span>
                <span>KES {depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Pay on Delivery:</span>
                <span>KES {balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Input Form */}
        <DepositCheckoutForm
          product={product}
          fullPrice={fullPrice}
          depositAmount={depositAmount}
          balanceDue={balanceDue}
        />

      </div>
    </main>
  )
}