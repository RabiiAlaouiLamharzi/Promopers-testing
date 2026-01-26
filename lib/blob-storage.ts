import { put, get, list } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

// Simple in-memory cache to store blob URLs by pathname
// This helps with immediate reads after writes within the same request
const blobUrlCache = new Map<string, string>()

/**
 * Clears the cache for a specific blob path
 * This should be called after writes to ensure fresh reads
 */
export function clearBlobCache(blobPath: string) {
  const normalizedPath = blobPath.startsWith('/') ? blobPath.slice(1) : blobPath
  blobUrlCache.delete(blobPath)
  blobUrlCache.delete(normalizedPath)
  // Clear all variations
  blobUrlCache.forEach((value, key) => {
    if (key === blobPath || key === normalizedPath || key.endsWith(blobPath) || key.endsWith(normalizedPath)) {
      blobUrlCache.delete(key)
    }
  })
  console.log(`[Blob Storage] Cache cleared for: ${blobPath}`)
}

/**
 * Uploads a file to Vercel Blob Storage
 * @param filename - The filename/path for the blob
 * @param file - The file to upload
 * @returns The blob URL
 * @throws Error with helpful message if blob storage is not configured
 */
export async function uploadToBlobStorage(filename: string, file: File | Blob) {
  // Check if blob storage token is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not configured. Please set it in Vercel environment variables.\n\n' +
      'To fix this:\n' +
      '1. Go to your Vercel project dashboard\n' +
      '2. Navigate to Settings > Environment Variables\n' +
      '3. Add BLOB_READ_WRITE_TOKEN with your token value\n' +
      '4. Get your token from: https://vercel.com/docs/storage/vercel-blob/quickstart\n' +
      '5. Redeploy your application\n\n' +
      'For local development, add it to your .env.local file.'
    )
  }

  try {
    // Convert File to Buffer for Vercel Blob
    // The put function can accept File, but converting to Buffer is more reliable
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type || 'image/jpeg',
    })
    return blob.url
  } catch (error: any) {
    // Provide helpful error message
    if (error?.message?.includes('No token found') || 
        error?.message?.includes('BLOB_READ_WRITE_TOKEN') ||
        error?.message?.includes('Unauthorized')) {
      throw new Error(
        'Blob storage authentication failed. Please verify BLOB_READ_WRITE_TOKEN is set correctly in Vercel environment variables.\n\n' +
        'See: https://vercel.com/docs/storage/vercel-blob/quickstart'
      )
    }
    throw error
  }
}

/**
 * Reads JSON data from Vercel Blob Storage using the blob URL directly
 * @param blobUrl - The full URL of the blob
 * @returns The parsed JSON data
 */
export async function readJsonFromBlobUrl<T>(blobUrl: string): Promise<T> {
  try {
    const blob = await get(blobUrl)
    const text = await blob.text()
    return JSON.parse(text) as T
  } catch (error: any) {
    console.error(`Error reading blob from URL ${blobUrl}:`, error)
    throw error
  }
}

/**
 * Reads JSON data from Vercel Blob Storage or falls back to local filesystem in development
 * @param blobPath - The path to the JSON file in blob storage (e.g., 'data/blogs.json')
 * @param localPath - The local filesystem path as fallback (for development)
 * @returns The parsed JSON data or empty array if not found
 */
export async function readJsonFromBlob<T>(blobPath: string, localPath?: string): Promise<T> {
  console.log(`[Blob Storage] Reading from blob path: "${blobPath}"`)
  
  // Check if blob storage token is configured - REQUIRED
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[Blob Storage] BLOB_READ_WRITE_TOKEN not configured - blob storage is required!')
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured. Please set it in Vercel environment variables.')
  }

  // In development ONLY, try local filesystem first for convenience
  // But still prefer blob storage if it exists
  if (process.env.NODE_ENV === 'development' && localPath) {
    try {
      // First check if blob exists
      const prefix = blobPath.substring(0, blobPath.lastIndexOf('/') + 1) || ''
      const blobs = await list({ prefix })
      const blobExists = blobs.blobs.some(b => {
        const blobPathname = b.pathname.startsWith('/') ? b.pathname.slice(1) : b.pathname
        const normalizedPath = blobPath.startsWith('/') ? blobPath.slice(1) : blobPath
        return blobPathname === normalizedPath || blobPathname === blobPath
      })

      // Only use local file if blob doesn't exist yet
      if (!blobExists && fs.existsSync(localPath)) {
        console.log(`[Blob Storage] Dev mode: Using local file (blob doesn't exist yet): ${localPath}`)
        const fileContents = fs.readFileSync(localPath, 'utf8')
        const data = JSON.parse(fileContents) as T
        // Auto-migrate to blob in background
        writeJsonToBlob(blobPath, data, localPath).catch(err => {
          console.warn('[Blob Storage] Background migration failed:', err)
        })
        return data
      }
    } catch (error) {
      // If checking fails, continue with blob storage read
      console.warn(`[Blob Storage] Error checking local file, using blob storage: ${error}`)
    }
  }

  try {
    // Normalize the blob path for comparison (remove leading slash if present)
    const normalizedPath = blobPath.startsWith('/') ? blobPath.slice(1) : blobPath
    
    // First, check if we have a cached URL (from a recent write)
    const cachedUrl = blobUrlCache.get(blobPath) || blobUrlCache.get(normalizedPath)
    if (cachedUrl) {
      try {
        const blob = await get(cachedUrl)
        const text = await blob.text()
        console.log(`[Blob Storage] Read from cache: ${blobPath}`)
        return JSON.parse(text) as T
      } catch (cacheError) {
        // Cache miss or invalid URL, continue with normal lookup
        console.warn(`[Blob Storage] Cache miss for ${blobPath}, trying list...`)
        blobUrlCache.delete(blobPath)
        blobUrlCache.delete(normalizedPath)
      }
    }
    
    // Try to find the blob by listing with prefix
    // First try with the directory prefix
    const prefix = normalizedPath.substring(0, normalizedPath.lastIndexOf('/') + 1) || ''
    console.log(`[Blob Storage] Listing blobs with prefix: "${prefix}"`)
    let blobs = await list({ prefix })
    console.log(`[Blob Storage] Found ${blobs.blobs.length} blobs with prefix "${prefix}":`, blobs.blobs.map(b => b.pathname))
    
    // Try to find exact match - normalize both paths for comparison
    let matchingBlob = blobs.blobs.find(b => {
      const blobPathname = b.pathname.startsWith('/') ? b.pathname.slice(1) : b.pathname
      const matches = (
        blobPathname === normalizedPath ||
        blobPathname === blobPath ||
        b.pathname === blobPath ||
        b.pathname === normalizedPath ||
        blobPathname.endsWith(`/${normalizedPath}`) ||
        blobPathname.endsWith(normalizedPath)
      )
      if (matches) {
        console.log(`[Blob Storage] Found matching blob: ${b.pathname} (matched against "${normalizedPath}")`)
      }
      return matches
    })
    
    // If not found with prefix, try listing all blobs (if prefix search didn't work)
    if (!matchingBlob) {
      try {
        const allBlobs = await list()
        if (process.env.NODE_ENV === 'development') {
          console.log(`Searching for blob: ${blobPath} (normalized: ${normalizedPath})`)
          console.log(`Found ${allBlobs.blobs.length} total blobs`)
          allBlobs.blobs.forEach(b => {
            console.log(`  - ${b.pathname}`)
          })
        }
        matchingBlob = allBlobs.blobs.find(b => {
          const blobPathname = b.pathname.startsWith('/') ? b.pathname.slice(1) : b.pathname
          return (
            blobPathname === normalizedPath ||
            blobPathname === blobPath ||
            b.pathname === blobPath ||
            b.pathname === normalizedPath ||
            blobPathname.endsWith(`/${normalizedPath}`) ||
            blobPathname.endsWith(normalizedPath)
          )
        })
      } catch (listError) {
        // If listing all fails, continue with what we have
        console.warn('Failed to list all blobs:', listError)
      }
    }
    
    if (matchingBlob) {
      // Cache the URL for future reads
      blobUrlCache.set(blobPath, matchingBlob.url)
      blobUrlCache.set(normalizedPath, matchingBlob.url)
      blobUrlCache.set(matchingBlob.pathname, matchingBlob.url)
      
      const blob = await get(matchingBlob.url)
      const text = await blob.text()
      console.log(`[Blob Storage] Read successfully: ${blobPath} (found as ${matchingBlob.pathname})`)
      return JSON.parse(text) as T
    }
    
    // Blob not found - return empty array
    // In production, local files are NOT used - everything must be in blob storage
    // Run /api/migrate endpoint to copy local data to blob storage
    console.warn(`[Blob Storage] Blob not found at path: "${blobPath}" (normalized: "${normalizedPath}") - returning empty array`)
    console.warn(`[Blob Storage] If you have local data, run POST /api/migrate to copy it to blob storage`)
    return [] as T
  } catch (error: any) {
    // NEVER fall back to local file in production - it's static and causes issues
    // If there's an error, log it and return empty array
    if (error?.status === 404 || error?.message?.includes('not found')) {
      console.warn(`[Blob Storage] Blob not found (404): ${blobPath}`)
      console.warn(`[Blob Storage] Run POST /api/migrate to copy local data to blob storage`)
      return [] as T
    }
    console.error(`[Blob Storage] Error reading JSON from blob storage: ${error}`, error)
    return [] as T
  }
}

/**
 * Writes JSON data to Vercel Blob Storage
 * @param blobPath - The path to the JSON file in blob storage (e.g., 'data/blogs.json')
 * @param data - The data to write (will be JSON stringified)
 * @param localPath - Optional local filesystem path for development fallback
 * @returns The actual pathname used by Vercel Blob Storage
 * @throws Error if blob storage is not configured or write fails
 */
export async function writeJsonToBlob<T>(blobPath: string, data: T, localPath?: string): Promise<string> {
  // In development, also write to local filesystem if path is provided
  if (process.env.NODE_ENV === 'development' && localPath) {
    try {
      const dataDir = path.dirname(localPath)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      fs.writeFileSync(localPath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      console.warn(`Failed to write to local filesystem: ${error}`)
    }
  }

  // Check if blob storage token is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not configured. Please set it in Vercel environment variables.\n\n' +
      'To fix this:\n' +
      '1. Go to your Vercel project dashboard\n' +
      '2. Navigate to Settings > Environment Variables\n' +
      '3. Add BLOB_READ_WRITE_TOKEN with your token value\n' +
      '4. Get your token from: https://vercel.com/docs/storage/vercel-blob/quickstart\n' +
      '5. Redeploy your application\n\n' +
      'For local development, add it to your .env.local file.'
    )
  }

  try {
    console.log(`[Blob Storage] Writing to blob path: "${blobPath}"`)
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    const result = await put(blobPath, blob, {
      access: 'public',
      addRandomSuffix: false,
    })
    
    // Log the actual pathname that was used (for debugging)
    console.log(`[Blob Storage] WRITE SUCCESS - Actual pathname: "${result.pathname}" (URL: ${result.url})`)
    console.log(`[Blob Storage] WRITE SUCCESS - Expected path: "${blobPath}"`)
    console.log(`[Blob Storage] WRITE SUCCESS - Path match: ${result.pathname === blobPath}`)
    console.log(`[Blob Storage] WRITE SUCCESS - Data size: ${jsonString.length} bytes`)
    if (Array.isArray(data)) {
      console.log(`[Blob Storage] WRITE SUCCESS - Array length: ${data.length}`)
    }
    
    // Clear old cache entries to force fresh reads
    clearBlobCache(blobPath)
    clearBlobCache(result.pathname)
    
    // Cache the new URL for immediate reads
    blobUrlCache.set(blobPath, result.url)
    blobUrlCache.set(result.pathname, result.url)
    
    // Return the actual pathname used so we can use it for reading
    return result.pathname
  } catch (error: any) {
    // Check if blob store is suspended
    if (error?.message?.includes('suspended') || error?.message?.includes('Suspended')) {
      console.error(`[Blob Storage] CRITICAL: Blob store is suspended!`)
      console.error(`[Blob Storage] Please check Vercel dashboard → Storage → Blob Storage`)
      console.error(`[Blob Storage] Common causes: billing issue, exceeded limits`)
      throw new Error(
        'Vercel Blob Storage is suspended. Please:\n' +
        '1. Go to Vercel Dashboard → Settings → Storage → Blob Storage\n' +
        '2. Check billing/payment method is valid\n' +
        '3. Reactivate blob storage\n' +
        '4. After reactivating, run POST /api/migrate to restore data'
      )
    }
    // Provide helpful error message for auth errors
    if (error?.message?.includes('No token found') || 
        error?.message?.includes('BLOB_READ_WRITE_TOKEN') ||
        error?.message?.includes('Unauthorized')) {
      throw new Error(
        'Blob storage authentication failed. Please verify BLOB_READ_WRITE_TOKEN is set correctly in Vercel environment variables.\n\n' +
        'See: https://vercel.com/docs/storage/vercel-blob/quickstart'
      )
    }
    throw error
  }
}

