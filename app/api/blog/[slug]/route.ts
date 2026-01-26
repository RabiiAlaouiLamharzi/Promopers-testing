import { NextRequest, NextResponse } from 'next/server'
import { updateBlog, deleteBlog, getBlogBySlug } from '@/lib/blogs'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const body = await request.json()
    const resolvedParams = await Promise.resolve(params)
    const slug = resolvedParams.slug
    
    const updated = await updateBlog(slug, body)
    if (!updated) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const slug = resolvedParams.slug
    const deleted = await deleteBlog(slug)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
    }, { status: 500 })
  }
}

