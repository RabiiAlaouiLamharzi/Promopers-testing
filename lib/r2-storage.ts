import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

// Cloudflare R2 is S3-compatible, so we use AWS SDK
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'promopers-data'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://pub-${R2_ACCOUNT_ID}.r2.dev`

// Initialize S3 client for R2
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      throw new Error(
        'R2 storage not configured. Please set:\n' +
        '- R2_ACCOUNT_ID\n' +
        '- R2_ACCESS_KEY_ID\n' +
        '- R2_SECRET_ACCESS_KEY\n' +
        '- R2_BUCKET_NAME (optional, defaults to promopers-data)\n' +
        '- R2_PUBLIC_URL (optional)\n\n' +
        'Get these from Cloudflare Dashboard → R2 → Your Bucket → Settings'
      )
    }

    s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto' region
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return s3Client
}

/**
 * Reads JSON data from Cloudflare R2
 */
export async function readJsonFromR2<T>(key: string): Promise<T> {
  try {
    const client = getS3Client()
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    const response = await client.send(command)
    
    if (!response.Body) {
      console.warn(`[R2 Storage] File not found: ${key}`)
      return [] as T
    }

    const text = await response.Body.transformToString()
    const data = JSON.parse(text) as T
    
    console.log(`[R2 Storage] Read successfully: ${key}`)
    return data
  } catch (error: any) {
    if (error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404) {
      console.warn(`[R2 Storage] File not found: ${key} - returning empty array`)
      return [] as T
    }
    console.error(`[R2 Storage] Error reading ${key}:`, error)
    throw error
  }
}

/**
 * Writes JSON data to Cloudflare R2
 */
export async function writeJsonToR2<T>(key: string, data: T): Promise<string> {
  try {
    const client = getS3Client()
    const jsonString = JSON.stringify(data, null, 2)
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
    })

    await client.send(command)
    
    const url = `${R2_PUBLIC_URL}/${key}`
    console.log(`[R2 Storage] Written successfully: ${key}`)
    console.log(`[R2 Storage] URL: ${url}`)
    
    return url
  } catch (error: any) {
    console.error(`[R2 Storage] Error writing ${key}:`, error)
    throw new Error(`Failed to write to R2: ${error?.message || String(error)}`)
  }
}

/**
 * Lists all objects in R2 bucket (for debugging)
 */
export async function listR2Objects(prefix?: string): Promise<string[]> {
  try {
    const client = getS3Client()
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    })

    const response = await client.send(command)
    const keys = (response.Contents || []).map(obj => obj.Key || '').filter(Boolean)
    
    console.log(`[R2 Storage] Found ${keys.length} objects with prefix "${prefix || ''}"`)
    return keys
  } catch (error: any) {
    console.error(`[R2 Storage] Error listing objects:`, error)
    return []
  }
}

