'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProductAction(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const size = formData.get('size') as string
  const color = formData.get('color') as string
  const condition = formData.get('condition') as string
  const rawImages = formData.get('images') as string

  let images: string[] = []
  try {
    images = rawImages ? JSON.parse(rawImages) : []
  } catch (err) {
    console.error('Error parsing images JSON:', err)
    images = []
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        title,
        description,
        price,
        size,
        color,
        condition,
        images,
        status: 'AVAILABLE',
      },
    ])

  if (error) {
    console.error('Database Error:', error.message)
    throw new Error(`Failed to create product: ${error.message}`)
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/products')

  return { success: true, data }
}

export async function toggleProductStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const nextStatus = currentStatus === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE'

  const { error } = await supabase
    .from('products')
    .update({ status: nextStatus })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update product status: ${error.message}`)
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/products')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/products')
}