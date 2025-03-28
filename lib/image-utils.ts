import { supabase } from './supabase'

/**
 * Uploads an image file to the Supabase storage bucket and returns its public URL.
 * 
 * @param {File} file - The image file to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the public URL of the uploaded image.
 * @throws {Error} - Throws an error if the upload process fails.
 */

export async function uploadImage(file: File): Promise<string> {
  // Extract the file extension from the original filename
  const fileExt = file.name.split('.').pop()

  // Generate a random filename to prevent conflicts
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  // Attempt to upload the file to the 'products' storage bucket
  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(filePath, file)

  // Throw an error if the upload fails
  if (uploadError) {
    throw uploadError
  }

  // Retrieve the public URL of the uploaded file
  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)

  return data.publicUrl
} 