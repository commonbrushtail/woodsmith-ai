import { createServiceClient } from './supabase/admin'

/**
 * Get the public URL for a file in a storage bucket.
 */
export function getPublicUrl(bucket, filePath) {
  const supabase = createServiceClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Get a short-lived signed URL for a file in a private bucket.
 * @returns {Promise<string|null>}
 */
export async function getSignedUrl(bucket, filePath, expiresIn = 3600) {
  if (!filePath) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresIn)
  if (error) return null
  return data.signedUrl
}

/**
 * Upload a file to a storage bucket.
 * @returns {{ path: string|null, error: Error|null }}
 */
export async function uploadFile(bucket, file, filePath) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true })

  if (error) {
    return { path: null, error }
  }
  return { path: data.path, error: null }
}

/**
 * Delete a file from a storage bucket.
 * @returns {{ error: Error|null }}
 */
export async function deleteFile(bucket, filePath) {
  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  return { error: error || null }
}
