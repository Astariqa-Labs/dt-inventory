'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to enforce admin auth on every server action
async function verifyAdminSession() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized access. Admin authentication required.')
  }
  return supabase
}

export async function createProductAction(formData: FormData) {
  try {
    const supabase = await verifyAdminSession()

    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const rawPrice = formData.get('price') as string
    const price = parseFloat(rawPrice)
    const size = (formData.get('size') as string)?.trim()
    const color = (formData.get('color') as string)?.trim()
    const condition = (formData.get('condition') as string)?.trim()
    const rawImages = formData.get('images') as string

    // Strict field validation
    if (!title || isNaN(price) || price < 0 || !size || !condition) {
      return { success: false, error: 'Invalid or missing required fields.' }
    }

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
          description: description || null,
          price,
          size,
          color: color || null,
          condition,
          images,
          status: 'AVAILABLE',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database Error:', error.message)
      return { success: false, error: `Failed to create product: ${error.message}` }
    }

    revalidatePath('/admin/inventory')
    revalidatePath('/products')

    return { success: true, data }
  } catch (err: any) {
    console.error('Server Action Exception:', err.message)
    return { success: false, error: err.message || 'An unexpected error occurred.' }
  }
}

export async function toggleProductStatus(id: string, currentStatus: string) {
  const supabase = await verifyAdminSession()
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
  revalidatePath(`/products/${id}`)
}

export async function deleteProduct(id: string) {
  const supabase = await verifyAdminSession()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
}