import { NextRequest, NextResponse } from 'next/server'
import { writeReferences, writeBlogs, writeTestimonials } from '@/lib/jsonbin-storage'

/**
 * Manual upload endpoint - accepts JSON data in request body
 * Use this if local files aren't accessible in production
 */
export async function POST(request: NextRequest) {
  try {
    // Check if JSONBin.io is configured
    if (!process.env.JSONBIN_API_KEY) {
      return NextResponse.json({
        error: 'JSONBin.io API key is not configured',
        message: 'Please set JSONBIN_API_KEY in Vercel environment variables'
      }, { status: 500 })
    }

    const body = await request.json()
    const results = {
      references: { success: false, count: 0, error: null as string | null },
      blogs: { success: false, count: 0, error: null as string | null },
      testimonials: { success: false, count: 0, error: null as string | null }
    }

    // Upload References
    if (body.references && Array.isArray(body.references)) {
      try {
        await writeReferences(body.references)
        results.references = { success: true, count: body.references.length, error: null }
        console.log(`[Migration Upload] Uploaded ${body.references.length} references`)
      } catch (error: any) {
        results.references.error = error?.message || String(error)
        console.error('[Migration Upload] Error uploading references:', error)
      }
    }

    // Upload Blogs
    if (body.blogs && Array.isArray(body.blogs)) {
      try {
        await writeBlogs(body.blogs)
        results.blogs = { success: true, count: body.blogs.length, error: null }
        console.log(`[Migration Upload] Uploaded ${body.blogs.length} blogs`)
      } catch (error: any) {
        results.blogs.error = error?.message || String(error)
        console.error('[Migration Upload] Error uploading blogs:', error)
      }
    }

    // Upload Testimonials
    if (body.testimonials && Array.isArray(body.testimonials)) {
      try {
        await writeTestimonials(body.testimonials)
        results.testimonials = { success: true, count: body.testimonials.length, error: null }
        console.log(`[Migration Upload] Uploaded ${body.testimonials.length} testimonials`)
      } catch (error: any) {
        results.testimonials.error = error?.message || String(error)
        console.error('[Migration Upload] Error uploading testimonials:', error)
      }
    }

    const allSuccess = results.references.success && results.blogs.success && results.testimonials.success
    const totalCount = results.references.count + results.blogs.count + results.testimonials.count

    return NextResponse.json({
      success: allSuccess,
      message: `Upload completed. Total items: ${totalCount}`,
      results
    }, { status: allSuccess ? 200 : 207 })

  } catch (error: any) {
    console.error('[Migration Upload] Fatal error:', error)
    return NextResponse.json({
      error: 'Upload failed',
      message: error?.message || String(error)
    }, { status: 500 })
  }
}

