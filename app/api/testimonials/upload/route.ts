import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/image-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `images/testimonials/${timestamp}-${originalName}`
    
    // Upload to available storage (R2 or Vercel Blob)
    const url = await uploadImage(filename, file)
    
    // Return the image URL
    return NextResponse.json({ url, filename: originalName })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    const errorMessage = error?.message || 'Failed to upload file'
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}

