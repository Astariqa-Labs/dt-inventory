'use client'

import { useState } from 'react'
import Image from 'next/image'
import CheckoutModal from '../CheckoutModal'

export default function ProductDetailGallery({ product }: { product: any }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const images = product.images && product.images.length > 0 ? product.images : []
  const isSold = product.status === 'SOLD'

  return (
    <div className="space-y-4">
      {/* Main High-Res Image Display */}
      <div className="relative aspect-square w-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        {images[activeImageIndex] ? (
          <Image
            src={images[activeImageIndex]}
            alt={product.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 text-xs uppercase font-mono">
            No Image Available
          </div>
        )}

        {isSold && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-black uppercase tracking-widest text-white bg-red-600/90 px-4 py-1.5 rounded-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((imgUrl: string, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-square w-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-amber-600 ring-2 ring-amber-600/20'
                  : 'border-stone-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={imgUrl} alt={`View ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Buy Button */}
      <button
        type="button"
        disabled={isSold}
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-200 disabled:text-stone-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isSold ? 'Pair Sold Out' : 'Buy Now via M-Pesa'}
      </button>

      {/* Modal Trigger */}
      {isModalOpen && (
        <CheckoutModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}