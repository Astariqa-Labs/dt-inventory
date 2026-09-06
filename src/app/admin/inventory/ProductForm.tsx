'use client'

import { useState } from 'react'
import { uploadShoeImages } from '@/lib/supabase/storage'
import { createProductAction } from './actions'

export default function ProductForm() {
  const [images, setImages] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    if (!images || images.length === 0) {
      alert('Please select at least one shoe image.')
      return
    }

    setUploading(true)

    try {
      const imageUrls = await uploadShoeImages(Array.from(images))

      if (!imageUrls || imageUrls.length === 0) {
        throw new Error('Image upload failed.')
      }

      formData.set('images', JSON.stringify(imageUrls))
      await createProductAction(formData)
      
      formElement.reset()
      setImages(null)
      alert('Product created successfully!')
    } catch (err: any) {
      console.error('Submit error:', err.message)
      alert(`Error: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
          Product Title
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. Clarks Desert Boot"
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900 placeholder-stone-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Describe condition, origin, or suede texture..."
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900 placeholder-stone-400"
        />
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Price (KES)
          </label>
          <input
            type="number"
            name="price"
            required
            step="1"
            placeholder="3500"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900 placeholder-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Size (UK)
          </label>
          <input
            type="text"
            name="size"
            required
            placeholder="UK 9"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900 placeholder-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Color
          </label>
          <input
            type="text"
            name="color"
            required
            placeholder="e.g. Navy Blue, Sand"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900 placeholder-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Condition
          </label>
          <select
            name="condition"
            required
            defaultValue="LIKE_NEW"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-900"
          >
            <option value="LIKE_NEW">Like New</option>
            <option value="GENTLY_USED">Gently Used</option>
            <option value="WELL_LOVED">Well Loved</option>
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
          Shoe Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          disabled={uploading}
          className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-stone-200 file:text-stone-800 hover:file:bg-amber-100 hover:file:text-amber-800 cursor-pointer"
        />
        {images && images.length > 0 && (
          <p className="text-[11px] font-semibold text-amber-700 mt-1">
            {images.length} file{images.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold uppercase tracking-wider rounded-xl text-xs transition shadow-sm disabled:opacity-50 cursor-pointer mt-2"
      >
        {uploading ? 'Uploading & Saving...' : 'Save Shoe Entry'}
      </button>
    </form>
  )
}