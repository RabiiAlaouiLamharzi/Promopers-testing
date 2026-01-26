import { NextRequest, NextResponse } from 'next/server'
import { getReferenceBySlug, updateReference, deleteReference, getAllReferences } from '@/lib/references'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const searchParams = request.nextUrl.searchParams
    const admin = searchParams.get('admin') === 'true'
    const reference = await getReferenceBySlug(resolvedParams.slug, admin)
    if (!reference) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 })
    }
    return NextResponse.json(reference)
  } catch (error) {
    console.error('Error fetching reference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const body = await request.json()
    const resolvedParams = await Promise.resolve(params)
    
    console.log(`[PUT /api/references/${resolvedParams.slug}] Received request body:`, JSON.stringify(body, null, 2))
    
    const updated = await updateReference(resolvedParams.slug, body)
    
    if (!updated) {
      console.error(`[PUT /api/references/${resolvedParams.slug}] Reference not found`)
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 })
    }
    
    console.log(`[PUT /api/references/${resolvedParams.slug}] Reference updated successfully`)
    return NextResponse.json(updated)
  } catch (error: any) {
    // Always log full error details for debugging
    const errorMessage = error?.message || String(error)
    const errorStack = error?.stack
    const resolvedParams = await Promise.resolve(params)
    console.error(`[PUT /api/references/${resolvedParams.slug}] Error updating reference:`, {
      message: errorMessage,
      stack: errorStack,
      error: error
    })
    
    // Return detailed error in production so user can see what went wrong
    return NextResponse.json({ 
      error: 'Failed to update reference',
      message: errorMessage,
      details: errorStack || undefined
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const deleted = await deleteReference(resolvedParams.slug)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Reference deleted successfully' })
  } catch (error) {
    console.error('Error deleting reference:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
    }, { status: 500 })
  }
}

