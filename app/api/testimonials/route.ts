import { NextRequest, NextResponse } from 'next/server'
import { getAllTestimonials, createTestimonial } from '@/lib/testimonials'
import type { Testimonial } from '@/lib/testimonials'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const admin = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true'
    
    const testimonials = await getAllTestimonials()
    const filtered = admin 
      ? testimonials 
      : testimonials.filter(t => t.published)
    
    return NextResponse.json(filtered.sort((a, b) => a.order - b.order))
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.author || !body.position || !body.quote || !body.image || !body.authorImage) {
      return NextResponse.json(
        { error: 'Author, position, quote, image, and authorImage are required' },
        { status: 400 }
      )
    }

    const newTestimonial = await createTestimonial({
      author: body.author,
      position: body.position,
      quote: body.quote,
      image: body.image,
      authorImage: body.authorImage,
      order: body.order || 0,
      published: body.published !== undefined ? body.published : false,
      translations: body.translations || { fr: {}, de: {}, it: {} }
    })

    return NextResponse.json(newTestimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
    }, { status: 500 })
  }
}

