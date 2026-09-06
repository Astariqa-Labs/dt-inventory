'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  description?: string
  price: number | string
  size: string
  color?: string
  condition: string
  images: string[]
  status?: string
}

function formatPriceKES(price: number | string) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

function formatCondition(condition: string) {
  const labels: Record<string, string> = {
    LIKE_NEW: 'Like New',
    GENTLY_USED: 'Gently Used',
    WELL_LOVED: 'Well Loved',
  }
  return labels[condition] || condition.replace('_', ' ')
}

export default function ProductCard({ product }: { product: Product }) {
  const isSold = product.status === 'SOLD'
  const primaryImage = product.images?.[0]

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/60 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Main Image Container */}
        <div className="relative aspect-square bg-stone-100 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-stone-400 text-xs uppercase font-mono">
              No Image Available
            </div>
          )}

          {/* Condition Badge */}
          <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-stone-100 border border-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {formatCondition(product.condition)}
          </span>

          {/* Sold Overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-black uppercase tracking-widest text-white bg-red-600/90 px-3 py-1 rounded-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Details & Pricing */}
        <div className="p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base text-stone-900 leading-snug group-hover:text-amber-700 transition">
              {product.title}
            </h3>
            <span className="font-mono font-black text-amber-700 text-base whitespace-nowrap">
              {formatPriceKES(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            {product.color && <span>{product.color}</span>}
            {product.color && <span>•</span>}
            <span className="text-stone-700">UK {product.size}</span>
          </div>

          {product.description && (
            <p className="text-xs text-stone-600 line-clamp-2 pt-1 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        <div className="w-full py-3 bg-stone-100 group-hover:bg-amber-600 text-stone-800 group-hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition text-center shadow-sm">
          {isSold ? 'View Details' : 'VIEW →'}
        </div>
      </div>
    </Link>
  )
}