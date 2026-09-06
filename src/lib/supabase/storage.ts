import { createClient } from '@/lib/supabase/client'

export async function uploadShoeImages(files: File[]): Promise<string[]> {
  const supabase = createClient()

  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `inventory/${fileName}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (error) {
      console.error('Image upload error:', error.message)
      throw new Error(`Upload failed for ${file.name}: ${error.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  })

  return await Promise.all(uploadPromises)
}