'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addThriftProduct(formData: FormData) {
  const supabase = await createClient()

  const productData = {
    title: formData.get('title') as string,
    brand: 'Clarks',
    size: formData.get('size') as string,
    color: formData.get('color') as string,
    condition: formData.get('condition') as 'LIKE_NEW' | 'GENTLY_USED' | 'WELL_LOVED',
    price: parseFloat(formData.get('price') as string),
    description: formData.get('description') as string,
    images: JSON.parse(formData.get('images') as string),
    status: 'AVAILABLE'
  }

  const { error } = await supabase.from('products').insert([productData])

  if (error) throw new Error(error.message)

  revalidatePath('/admin/inventory')
  revalidatePath('/products')
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/inventory')
  revalidatePath('/products')
}

export async function updateProductStatus(productId: string, status: 'AVAILABLE' | 'RESERVED' | 'SOLD') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/inventory')
  revalidatePath('/products')
}