import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogs, createBlog, getBlogBySlug } from '@/lib/blogs'
import type { Blog } from '@/lib/blogs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const admin = searchParams.get('admin') === 'true'
    
    if (slug) {
      const blog = admin ? (await getAllBlogs()).find(b => b.slug === slug) : await getBlogBySlug(slug)
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      return NextResponse.json(blog)
    }
    
    const blogs = await getAllBlogs()
    const filteredBlogs = admin ? blogs : blogs.filter(blog => blog.published)
    return NextResponse.json(filteredBlogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.slug || !body.title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      )
    }
    
    // Check if slug already exists
    const existing = await getBlogBySlug(body.slug, true)
    if (existing) {
      return NextResponse.json(
        { error: 'Blog with this slug already exists' },
        { status: 400 }
      )
    }
    
    const newBlog = await createBlog({
      slug: body.slug,
      title: body.title,
      author: body.author || 'Lukas Berger',
      date: body.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: body.category || 'Events',
      image: body.image || '',
      content: body.content || [],
      published: body.published !== undefined ? body.published : false
    })
    
    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
    }, { status: 500 })
  }
}

