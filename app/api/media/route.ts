import { NextRequest, NextResponse } from 'next/server'
import { readJsonFromBin, writeJsonToBin } from '@/lib/jsonbin-storage'

const MEDIA_BIN_ID = process.env.JSONBIN_MEDIA_BIN_ID || '694c964443b1c97be90397df'

export interface MediaStorage {
  hero: {
    videoUrl?: string
    [key: string]: string | undefined // logos
  }
  about: {
    [key: string]: string // factor images
  }
  aboutPage: {
    [key: string]: string // about page images (intro, timeline, etc.)
  }
  works: {
    [key: string]: string // blog images
  }
  carousels: {
    [key: string]: string // carousel images (cocacola, samsung, harman)
  }
  updatedAt: string
}

export async function GET(request: NextRequest) {
  try {
    const media = await readJsonFromBin<MediaStorage>(MEDIA_BIN_ID)
    const response = NextResponse.json(media || {
      hero: {},
      about: {},
      aboutPage: {},
      works: {},
      carousels: {},
      updatedAt: new Date().toISOString()
    })
    
    // Add caching headers for faster subsequent requests
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    return response
  } catch (error) {
    console.error('[Media API] Error reading:', error)
    const response = NextResponse.json({
      hero: {},
      about: {},
      aboutPage: {},
      works: {},
      carousels: {},
      updatedAt: new Date().toISOString()
    })
    
    // Even on error, cache the empty response briefly
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60')
    
    return response
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Media API] Received POST request with body:', body)
    
    const { section, key, value } = body
    
    if (!section || !key || !value) {
      console.error('[Media API] Missing required fields:', { section, key, value })
      return NextResponse.json(
        { error: 'Section, key, and value are required' },
        { status: 400 }
      )
    }
    
    console.log(`[Media API] Saving: ${section}.${key} = ${value}`)
    
    // Get existing media
    let media: MediaStorage = {
      hero: {},
      about: {},
      aboutPage: {},
      works: {},
      carousels: {},
      updatedAt: new Date().toISOString()
    }
    
    try {
      const existing = await readJsonFromBin<MediaStorage>(MEDIA_BIN_ID)
      if (existing) {
        media = existing
      }
    } catch (error) {
      console.log('[Media API] No existing media, creating new')
    }
    
    // Update the specific media item
    if (!media[section as keyof MediaStorage]) {
      (media as any)[section] = {}
    }
    (media[section as keyof MediaStorage] as any)[key] = value
    media.updatedAt = new Date().toISOString()
    
    console.log('[Media API] Updated media object:', media)
    
    // Save to JSONBin
    await writeJsonToBin(MEDIA_BIN_ID, media)
    console.log('[Media API] ✅ Successfully saved to JSONBin')
    
    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('[Media API] Error saving:', error)
    return NextResponse.json(
      { error: 'Failed to save media' },
      { status: 500 }
    )
  }
}

