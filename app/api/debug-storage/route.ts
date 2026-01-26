import { NextRequest, NextResponse } from 'next/server'
import { readReferences, readBlogs, readTestimonials } from '@/lib/jsonbin-storage'

export async function GET() {
  try {
    const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY
    const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || 'default'
    
    // List all bins to see what's available
    let allBins: any[] = []
    try {
      const listResponse = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY || '',
        },
      })
      if (listResponse.ok) {
        const listData = await listResponse.json()
        allBins = Array.isArray(listData.record) ? listData.record : (listData.record ? [listData.record] : [])
      }
    } catch (e) {
      console.error('Error listing bins:', e)
    }
    
    // Expected bin names
    const expectedBinNames = {
      references: process.env.JSONBIN_REFERENCES_BIN_ID || `${JSONBIN_BIN_ID}-references`,
      blogs: process.env.JSONBIN_BLOGS_BIN_ID || `${JSONBIN_BIN_ID}-blogs`,
      testimonials: process.env.JSONBIN_TESTIMONIALS_BIN_ID || `${JSONBIN_BIN_ID}-testimonials`,
    }
    
    // Try to read each type
    const [references, blogs, testimonials] = await Promise.all([
      readReferences().catch(e => ({ error: e.message, data: [] })),
      readBlogs().catch(e => ({ error: e.message, data: [] })),
      readTestimonials().catch(e => ({ error: e.message, data: [] }))
    ])
    
    return NextResponse.json({
      configured: !!JSONBIN_API_KEY,
      expectedBinNames,
      allBins: allBins.map((b: any) => ({
        id: b.id,
        name: b.name || 'unnamed',
        createdAt: b.createdAt,
      })),
      data: {
        references: Array.isArray(references) ? references.length : 'error',
        blogs: Array.isArray(blogs) ? blogs.length : 'error',
        testimonials: Array.isArray(testimonials) ? testimonials.length : 'error'
      },
      raw: {
        references: Array.isArray(references) ? (references.length > 0 ? references[0] : 'empty') : references,
        blogs: Array.isArray(blogs) ? (blogs.length > 0 ? blogs[0] : 'empty') : blogs,
        testimonials: Array.isArray(testimonials) ? (testimonials.length > 0 ? testimonials[0] : 'empty') : testimonials
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || String(error),
      stack: error?.stack
    }, { status: 500 })
  }
}

