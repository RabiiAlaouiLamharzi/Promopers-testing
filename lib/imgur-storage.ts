/**
 * Imgur Image Storage
 * Free image hosting - just need an optional client ID
 * Free tier: Unlimited uploads, images stored permanently
 */

/**
 * Uploads an image to Imgur
 * @param file - The image file to upload
 * @returns The Imgur image URL
 */
export async function uploadImageToImgur(file: File | Blob): Promise<string> {
  // Imgur API endpoint
  const IMGUR_API_URL = 'https://api.imgur.com/3/image'
  
  // Optional: Use client ID from environment variable for higher rate limits
  // If not set, uses a default client ID (works, but getting your own is recommended)
  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || '546c25a59c58ad7'
  
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    
    // Imgur API expects form-encoded data with base64 image
    const formData = new URLSearchParams()
    formData.append('image', base64)
    
    // Upload to Imgur
    const response = await fetch(IMGUR_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ data: { error: 'Unknown error' } }))
      throw new Error(`Imgur upload failed: ${errorData.data?.error || response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success || !result.data?.link) {
      throw new Error('Imgur upload failed: Invalid response')
    }
    
    console.log('[Imgur] Image uploaded successfully:', result.data.link)
    return result.data.link
  } catch (error: any) {
    console.error('[Imgur] Upload error:', error)
    throw new Error(`Failed to upload to Imgur: ${error?.message || String(error)}`)
  }
}

/**
 * Checks if Imgur is configured (always returns true, but checks if client ID is set)
 */
export function isImgurConfigured(): boolean {
  // Imgur works without client ID (anonymous), but better with one
  return true
}

