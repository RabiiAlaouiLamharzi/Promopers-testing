/**
 * Unified Image Storage
 * Automatically detects and uses available storage (R2 or Vercel Blob)
 * JSONBin.io is only for JSON data, not images
 */

import { uploadImageToR2 } from './r2-storage'
import { uploadToBlobStorage } from './blob-storage'

/**
 * Checks if R2 storage is configured
 */
function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  )
}

/**
 * Checks if Vercel Blob storage is configured
 */
function isBlobStorageConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

/**
 * Uploads an image to the first available storage service
 * Priority: R2 (if configured) > Vercel Blob (if configured)
 * 
 * @param filename - The filename/path for the image
 * @param file - The file to upload
 * @returns The public URL of the uploaded image
 * @throws Error if no storage is configured
 */
export async function uploadImage(filename: string, file: File | Blob): Promise<string> {
  // Try R2 first if configured
  if (isR2Configured()) {
    try {
      console.log('[Image Storage] Using Cloudflare R2 storage')
      return await uploadImageToR2(filename, file)
    } catch (error: any) {
      console.error('[Image Storage] R2 upload failed:', error.message)
      // If R2 fails, try Vercel Blob as fallback
      if (isBlobStorageConfigured()) {
        console.log('[Image Storage] Falling back to Vercel Blob storage')
        return await uploadToBlobStorage(filename, file)
      }
      // If no fallback, throw the R2 error
      throw error
    }
  }

  // Try Vercel Blob if configured
  if (isBlobStorageConfigured()) {
    try {
      console.log('[Image Storage] Using Vercel Blob storage')
      return await uploadToBlobStorage(filename, file)
    } catch (error: any) {
      console.error('[Image Storage] Blob storage upload failed:', error.message)
      throw error
    }
  }

  // No storage configured
  throw new Error(
    'No image storage configured. Please configure one of the following:\n\n' +
    'Option 1: Cloudflare R2 (Recommended for production)\n' +
    '  - Set R2_ACCOUNT_ID\n' +
    '  - Set R2_ACCESS_KEY_ID\n' +
    '  - Set R2_SECRET_ACCESS_KEY\n' +
    '  - Set R2_BUCKET_NAME (optional)\n' +
    '  See: R2_SETUP.md\n\n' +
    'Option 2: Vercel Blob Storage\n' +
    '  - Set BLOB_READ_WRITE_TOKEN\n' +
    '  See: VERCEL_BLOB_SETUP.md\n\n' +
    'Note: JSONBin.io is only for JSON data storage, not images.'
  )
}

/**
 * Gets information about which storage is configured
 */
export function getStorageInfo(): {
  r2Configured: boolean
  blobConfigured: boolean
  storageType: 'r2' | 'blob' | 'none'
} {
  const r2Configured = isR2Configured()
  const blobConfigured = isBlobStorageConfigured()
  
  let storageType: 'r2' | 'blob' | 'none' = 'none'
  if (r2Configured) {
    storageType = 'r2'
  } else if (blobConfigured) {
    storageType = 'blob'
  }

  return {
    r2Configured,
    blobConfigured,
    storageType
  }
}

