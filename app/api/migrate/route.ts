import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { writeReferences, writeBlogs, writeTestimonials } from '@/lib/jsonbin-storage'
import { getAllReferences, saveReferences } from '@/lib/references'
import { getAllBlogs, saveBlogs } from '@/lib/blogs'
import { getAllTestimonials, saveTestimonials } from '@/lib/testimonials'

/**
 * Migration endpoint to copy all local JSON files to blob storage
 * This should be run ONCE after deployment to migrate existing data
 */
export async function POST(request: NextRequest) {
  try {
    const results = {
      references: { success: false, count: 0, error: null as string | null },
      blogs: { success: false, count: 0, error: null as string | null },
      testimonials: { success: false, count: 0, error: null as string | null }
    }

    // Check if JSONBin.io is configured
    if (!process.env.JSONBIN_API_KEY) {
      return NextResponse.json({
        error: 'JSONBin.io API key is not configured',
        message: 'Please set JSONBIN_API_KEY in Vercel environment variables. Get it from: https://jsonbin.io/api-keys'
      }, { status: 500 })
    }

    const dataDir = path.join(process.cwd(), 'data')

    // Migrate References
    try {
      const referencesPath = path.join(dataDir, 'references.json')
      console.log(`[Migration] Checking references file at: ${referencesPath}`)
      console.log(`[Migration] File exists: ${fs.existsSync(referencesPath)}`)
      
      if (fs.existsSync(referencesPath)) {
        const fileContent = fs.readFileSync(referencesPath, 'utf8')
        console.log(`[Migration] File size: ${fileContent.length} bytes`)
        const referencesData = JSON.parse(fileContent)
        const count = Array.isArray(referencesData) ? referencesData.length : 0
        console.log(`[Migration] Parsed ${count} references from file`)
        
        await writeReferences(referencesData)
        results.references = { success: true, count, error: null }
        console.log(`[Migration] Successfully migrated ${count} references to JSONBin.io`)
      } else {
        console.log(`[Migration] Local file not found, checking JSONBin.io...`)
        // Check if JSONBin.io already has data
        const existingReferences = await getAllReferences()
        if (existingReferences.length > 0) {
          results.references = { success: true, count: existingReferences.length, error: 'Already in JSONBin.io' }
          console.log(`[Migration] Found ${existingReferences.length} references already in JSONBin.io`)
        } else {
          results.references = { success: false, count: 0, error: 'Local file not found and JSONBin.io is empty' }
        }
      }
    } catch (error: any) {
      results.references.error = error?.message || String(error)
      console.error('[Migration] Error migrating references:', error)
      console.error('[Migration] Error stack:', error?.stack)
    }

    // Migrate Blogs
    try {
      const blogsPath = path.join(dataDir, 'blogs.json')
      console.log(`[Migration] Checking blogs file at: ${blogsPath}`)
      
      if (fs.existsSync(blogsPath)) {
        const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'))
        const count = Array.isArray(blogsData) ? blogsData.length : 0
        console.log(`[Migration] Parsed ${count} blogs from file`)
        
        await writeBlogs(blogsData)
        results.blogs = { success: true, count, error: null }
        console.log(`[Migration] Successfully migrated ${count} blogs to JSONBin.io`)
      } else {
        const existingBlogs = await getAllBlogs()
        if (existingBlogs.length > 0) {
          results.blogs = { success: true, count: existingBlogs.length, error: 'Already in JSONBin.io' }
        } else {
          results.blogs = { success: false, count: 0, error: 'Local file not found and JSONBin.io is empty' }
        }
      }
    } catch (error: any) {
      results.blogs.error = error?.message || String(error)
      console.error('[Migration] Error migrating blogs:', error)
      console.error('[Migration] Error stack:', error?.stack)
    }

    // Migrate Testimonials
    try {
      const testimonialsPath = path.join(dataDir, 'testimonials.json')
      console.log(`[Migration] Checking testimonials file at: ${testimonialsPath}`)
      
      if (fs.existsSync(testimonialsPath)) {
        const testimonialsData = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'))
        const count = Array.isArray(testimonialsData) ? testimonialsData.length : 0
        console.log(`[Migration] Parsed ${count} testimonials from file`)
        
        await writeTestimonials(testimonialsData)
        results.testimonials = { success: true, count, error: null }
        console.log(`[Migration] Successfully migrated ${count} testimonials to JSONBin.io`)
      } else {
        const existingTestimonials = await getAllTestimonials()
        if (existingTestimonials.length > 0) {
          results.testimonials = { success: true, count: existingTestimonials.length, error: 'Already in JSONBin.io' }
        } else {
          results.testimonials = { success: false, count: 0, error: 'Local file not found and JSONBin.io is empty' }
        }
      }
    } catch (error: any) {
      results.testimonials.error = error?.message || String(error)
      console.error('[Migration] Error migrating testimonials:', error)
      console.error('[Migration] Error stack:', error?.stack)
    }

    const allSuccess = results.references.success && results.blogs.success && results.testimonials.success
    const totalCount = results.references.count + results.blogs.count + results.testimonials.count

    return NextResponse.json({
      success: allSuccess,
      message: `Migration completed. Total items: ${totalCount}`,
      results
    }, { status: allSuccess ? 200 : 207 }) // 207 = Multi-Status

  } catch (error: any) {
    console.error('[Migration] Fatal error:', error)
    return NextResponse.json({
      error: 'Migration failed',
      message: error?.message || String(error)
    }, { status: 500 })
  }
}

/**
 * GET endpoint to check migration status
 */
export async function GET() {
  try {
    const [references, blogs, testimonials] = await Promise.all([
      getAllReferences(),
      getAllBlogs(),
      getAllTestimonials()
    ])

    return NextResponse.json({
      jsonbinStorage: {
        references: references.length,
        blogs: blogs.length,
        testimonials: testimonials.length
      },
      configured: !!process.env.JSONBIN_API_KEY
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check status',
      message: error?.message || String(error)
    }, { status: 500 })
  }
}

