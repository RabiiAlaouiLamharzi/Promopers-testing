/**
 * JSONBin.io Storage Implementation
 * Super simple JSON storage - just need an API key!
 * Free tier: 10,000 requests/month
 */

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3'
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || 'default'

// Bin IDs for each data type
// If JSONBIN_*_BIN_ID is set, use it directly (actual bin ID from JSONBin.io)
// Otherwise, use the known bin IDs as fallback (these are the actual bin IDs from JSONBin.io)
const KNOWN_BIN_IDS = {
  references: '6936a950d0ea881f401a6f82',
  blogs: '69369e9143b1c97be9df4def',
  testimonials: '69369e92d0ea881f401a5c39',
  jobs: 'default-jobs',
}

const BIN_IDS = {
  references: process.env.JSONBIN_REFERENCES_BIN_ID || KNOWN_BIN_IDS.references,
  blogs: process.env.JSONBIN_BLOGS_BIN_ID || KNOWN_BIN_IDS.blogs,
  testimonials: process.env.JSONBIN_TESTIMONIALS_BIN_ID || KNOWN_BIN_IDS.testimonials,
  jobs: process.env.JSONBIN_JOBS_BIN_ID || KNOWN_BIN_IDS.jobs,
}

// Cache for actual bin IDs returned by JSONBin.io (they're auto-generated)
const binIdCache = new Map<string, string>()

function getHeaders() {
  if (!JSONBIN_API_KEY) {
    throw new Error(
      'JSONBin.io API key not configured. Please set JSONBIN_API_KEY in environment variables.\n\n' +
      'Get your API key from: https://jsonbin.io/api-keys'
    )
  }
  return {
    'Content-Type': 'application/json',
    'X-Master-Key': JSONBIN_API_KEY,
  }
}

/**
 * Finds a bin by name by listing all bins
 * Returns the actual bin ID that matches the name
 */
async function findBinByName(binName: string): Promise<string | null> {
  try {
    console.log(`[JSONBin] Searching for bin by name: "${binName}"`)
    
    // List all bins - JSONBin.io doesn't have a direct "get by name" endpoint
    const response = await fetch(`${JSONBIN_API_URL}/b`, {
      method: 'GET',
      headers: getHeaders(),
    })
    
    if (!response.ok) {
      console.error(`[JSONBin] Failed to list bins: ${response.status} ${response.statusText}`)
      return null
    }
    
    const data = await response.json()
    console.log(`[JSONBin] Listed ${data.record?.length || 0} bins`)
    
    // The response structure might be different - let's check
    const bins = Array.isArray(data.record) ? data.record : (data.record ? [data.record] : [])
    
    // Log all bins for debugging
    console.log(`[JSONBin] Available bins:`, bins.map((b: any) => ({ id: b.id, name: b.name || 'unnamed' })))
    
    // Find bin by name (check both name and id fields)
    const matchingBin = bins.find((b: any) => {
      const binNameLower = binName.toLowerCase()
      const bName = (b.name || '').toLowerCase()
      const bId = (b.id || '').toLowerCase()
      
      return bName === binNameLower || 
             bId === binNameLower ||
             bName.includes(binNameLower) ||
             bName.endsWith(binNameLower)
    })
    
    if (matchingBin) {
      console.log(`[JSONBin] ✅ Found bin by name "${binName}": ${matchingBin.id} (name: ${matchingBin.name || 'unnamed'})`)
      return matchingBin.id
    }
    
    console.warn(`[JSONBin] ❌ Bin not found by name: "${binName}"`)
    return null
  } catch (error) {
    console.error(`[JSONBin] Error finding bin by name:`, error)
    return null
  }
}

/**
 * Reads JSON data from JSONBin.io
 * Uses cached bin ID if available, otherwise tries the provided ID/name or searches by name
 */
export async function readJsonFromBin<T>(binId: string): Promise<T> {
  try {
    console.log(`[JSONBin] Reading bin: ${binId}`)
    
    // Check cache first for actual bin ID
    let actualBinId = binIdCache.get(binId) || binId
    
    // Try reading with current ID
    let url = `${JSONBIN_API_URL}/b/${actualBinId}/latest`
    let response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })

    // If 404 and we haven't tried searching by name yet, try that
    if (!response.ok && response.status === 404 && actualBinId === binId) {
      console.log(`[JSONBin] Bin not found by ID "${binId}", trying known IDs and name search...`)
      
      // First, try known bin IDs based on the bin name pattern
      let foundId: string | null = null
      
      if (binId.includes('references') || binId === 'default-references') {
        foundId = KNOWN_BIN_IDS.references
        console.log(`[JSONBin] Trying known references bin ID: ${foundId}`)
      } else if (binId.includes('blogs') || binId === 'default-blogs') {
        foundId = KNOWN_BIN_IDS.blogs
        console.log(`[JSONBin] Trying known blogs bin ID: ${foundId}`)
      } else if (binId.includes('testimonials') || binId === 'default-testimonials') {
        foundId = KNOWN_BIN_IDS.testimonials
        console.log(`[JSONBin] Trying known testimonials bin ID: ${foundId}`)
      }
      
      // If known ID didn't work or wasn't found, try name search
      if (!foundId) {
        foundId = await findBinByName(binId)
      }
      
      if (foundId) {
        actualBinId = foundId
        binIdCache.set(binId, foundId)
        url = `${JSONBIN_API_URL}/b/${foundId}/latest`
        response = await fetch(url, {
          method: 'GET',
          headers: getHeaders(),
        })
        console.log(`[JSONBin] Retrying read with found ID: ${foundId}`)
      } else {
        console.warn(`[JSONBin] Could not find bin by name or known IDs: ${binId}`)
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      if (response.status === 404) {
        console.warn(`[JSONBin] Bin not found: ${binId} (tried ${actualBinId}) - returning empty array`)
        return [] as T
      }
      throw new Error(`JSONBin API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    let result = data.record as T
    
    // Handle different data structures from JSONBin.io
    // Sometimes the data might be nested or in a different format
    if (!result) {
      console.warn(`[JSONBin] No record found in response, checking alternative structures...`)
      // Try alternative structures
      if (data.data) result = data.data as T
      if (data.references) result = data.references as T
      if (data.blogs) result = data.blogs as T
      if (data.testimonials) result = data.testimonials as T
    }
    
    // Ensure arrays are properly handled
    // If result is not an array but we expect one, try to extract it
    if (!Array.isArray(result) && typeof result === 'object' && result !== null) {
      const keys = Object.keys(result)
      
      // Check if it's an object with an array property
      if (keys.length === 1 && Array.isArray(result[keys[0] as keyof typeof result])) {
        console.log(`[JSONBin] Found array in nested property: ${keys[0]}`)
        result = (result[keys[0] as keyof typeof result] as unknown) as T
      } 
      // Check if it's an object where values are reference objects (convert to array)
      else if (keys.length > 0) {
        const firstValue = result[keys[0] as keyof typeof result]
        // If values look like reference objects (have slug, id, name, etc.), convert to array
        if (firstValue && typeof firstValue === 'object' && ('slug' in firstValue || 'id' in firstValue || 'name' in firstValue)) {
          console.log(`[JSONBin] Converting object with ${keys.length} keys to array`)
          result = Object.values(result) as unknown as T
        }
      }
    }
    
    // Update cache with the ID that worked
    if (data.metadata?.id) {
      binIdCache.set(binId, data.metadata.id)
      console.log(`[JSONBin] Cached bin ID: ${binId} -> ${data.metadata.id}`)
    }
    
    const resultLength = Array.isArray(result) ? result.length : (result ? 1 : 0)
    console.log(`[JSONBin] ✅ Read successfully from bin: ${binId} (ID: ${data.metadata?.id || actualBinId}) - ${resultLength} items`)
    console.log(`[JSONBin] Data structure:`, {
      isArray: Array.isArray(result),
      type: typeof result,
      keys: result && typeof result === 'object' ? Object.keys(result) : 'N/A'
    })
    return result
  } catch (error: any) {
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      console.warn(`[JSONBin] Bin not found: ${binId} - returning empty array`)
      return [] as T
    }
    console.error(`[JSONBin] Error reading ${binId}:`, error)
    throw error
  }
}

/**
 * Writes JSON data to JSONBin.io
 * Creates bin if it doesn't exist, updates if it does
 */
export async function writeJsonToBin<T>(binId: string, data: T): Promise<string> {
  try {
    // Try to read first to see if bin exists
    let binExists = false
    let existingBinId = binId
    try {
      await readJsonFromBin(binId)
      binExists = true
      existingBinId = binId
    } catch {
      binExists = false
    }

    // For JSONBin.io v3 API:
    // - POST /b creates a new bin (returns bin ID)
    // - PUT /b/{id} updates existing bin
    const url = binExists 
      ? `${JSONBIN_API_URL}/b/${existingBinId}` // Update existing
      : `${JSONBIN_API_URL}/b` // Create new

    const headers = {
      ...getHeaders(),
      ...(binExists ? {} : { 'X-Bin-Name': binId }), // Optional: set bin name when creating
    }

    const response = await fetch(url, {
      method: binExists ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[JSONBin] API Error Response:`, { status: response.status, statusText: response.statusText, body: errorText })
      throw new Error(`JSONBin API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    const actualBinId = result.metadata?.id || binId
    
    // Cache the actual bin ID for future reads
    if (actualBinId) {
      binIdCache.set(binId, actualBinId)
      console.log(`[JSONBin] Cached bin ID: ${binId} -> ${actualBinId}`)
    }
    
    console.log(`[JSONBin] Written successfully to bin: ${actualBinId} (${binExists ? 'updated' : 'created'})`)
    console.log(`[JSONBin] Bin metadata:`, JSON.stringify(result.metadata, null, 2))
    
    return actualBinId
  } catch (error: any) {
    console.error(`[JSONBin] Error writing ${binId}:`, error)
    throw new Error(`Failed to write to JSONBin: ${error?.message || String(error)}`)
  }
}

/**
 * Get bin IDs for each data type
 */
export function getBinIds() {
  return BIN_IDS
}

// Export convenience functions for each data type
// No chunking needed - files are optimized to be under 1MB
export async function readReferences<T>(): Promise<T> {
  return readJsonFromBin<T>(BIN_IDS.references)
}

export async function writeReferences<T>(data: T): Promise<string> {
  return writeJsonToBin(BIN_IDS.references, data)
}

export async function readBlogs<T>(): Promise<T> {
  return readJsonFromBin<T>(BIN_IDS.blogs)
}

export async function writeBlogs<T>(data: T): Promise<string> {
  return writeJsonToBin(BIN_IDS.blogs, data)
}

export async function readTestimonials<T>(): Promise<T> {
  return readJsonFromBin<T>(BIN_IDS.testimonials)
}

export async function writeTestimonials<T>(data: T): Promise<string> {
  return writeJsonToBin(BIN_IDS.testimonials, data)
}

export async function readJobs<T>(): Promise<T> {
  return readJsonFromBin<T>(BIN_IDS.jobs)
}

export async function writeJobs<T>(data: T): Promise<string> {
  return writeJsonToBin(BIN_IDS.jobs, data)
}

