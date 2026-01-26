import { NextRequest, NextResponse } from 'next/server'
import { getAllReferences, createReference, getReferenceBySlug } from '@/lib/references'
import type { Reference } from '@/lib/references'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const admin = searchParams.get('admin') === 'true'
    
    console.log(`[GET /api/references] Request - slug: ${slug}, admin: ${admin}`)
    
    if (slug) {
      const reference = admin ? (await getAllReferences()).find(ref => ref.slug === slug) : await getReferenceBySlug(slug)
      if (!reference) {
        console.log(`[GET /api/references] Reference not found: ${slug}`)
        return NextResponse.json({ error: 'Reference not found' }, { status: 404 })
      }
      console.log(`[GET /api/references] Found reference: ${slug}`)
      return NextResponse.json(reference)
    }
    
    const references = await getAllReferences()
    console.log(`[GET /api/references] Retrieved ${references.length} total references`)
    const filteredReferences = admin ? references : references.filter(ref => ref.published)
    console.log(`[GET /api/references] Returning ${filteredReferences.length} references (admin: ${admin})`)
    if (admin && references.length > 0) {
      console.log(`[GET /api/references] Reference slugs:`, references.map(r => r.slug))
    }
    return NextResponse.json(filteredReferences)
  } catch (error: any) {
    console.error('[GET /api/references] Error fetching references:', {
      message: error?.message || String(error),
      stack: error?.stack,
      error: error
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[POST /api/references] Received request body:', JSON.stringify(body, null, 2))
    
    // Basic validation
    if (!body.slug || !body.name) {
      console.error('[POST /api/references] Validation failed: missing slug or name')
      return NextResponse.json(
        { error: 'Slug and name are required' },
        { status: 400 }
      )
    }
    
    // Check if slug already exists
    const existing = await getReferenceBySlug(body.slug, true)
    if (existing) {
      console.error(`[POST /api/references] Slug already exists: ${body.slug}`)
      return NextResponse.json(
        { error: 'Reference with this slug already exists' },
        { status: 400 }
      )
    }
    
    console.log('[POST /api/references] Creating reference with slug:', body.slug)
    
    const newReference = await createReference({
      slug: body.slug,
      name: body.name,
      tagline: body.tagline || '',
      heroImage: body.heroImage || '',
      logo: body.logo || '',
      description: body.description || [],
      responsibilities: body.responsibilities || [],
      additionalText: body.additionalText || '',
      services: body.services || [],
      sectionTitle: body.sectionTitle || '',
      subheading: body.subheading || '',
      additionalDescription: body.additionalDescription || [],
      responsibilitiesHeading: body.responsibilitiesHeading || '',
      client: body.client || '',
      location: body.location || '',
      date: body.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tags: body.tags || [],
      published: body.published !== undefined ? body.published : false,
      images: body.images || [],
      translations: body.translations || {}
    })
    
    console.log('[POST /api/references] Reference created successfully:', newReference.id)
    
    return NextResponse.json(newReference, { status: 201 })
  } catch (error: any) {
    // Always log full error details for debugging
    const errorMessage = error?.message || String(error)
    const errorStack = error?.stack
    console.error('[POST /api/references] Error creating reference:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    })
    
    // Return detailed error in production so user can see what went wrong
    return NextResponse.json({ 
      error: 'Failed to create reference',
      message: errorMessage,
      details: errorStack || undefined
    }, { status: 500 })
  }
}

