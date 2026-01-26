import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { uploadImageToImgur } from '@/lib/imgur-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'video' or 'image'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // For images: use Imgur in production, local filesystem in development
    if (type !== 'video' && file.type.startsWith('image/')) {
      // Production: upload to Imgur
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        try {
          const url = await uploadImageToImgur(file)
          return NextResponse.json({ 
            success: true, 
            url,
            filename: file.name 
          })
        } catch (error: any) {
          console.error('[Home Upload API] Imgur upload failed:', error)
          return NextResponse.json({ 
            error: error?.message || 'Failed to upload image to Imgur',
            details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
          }, { status: 500 })
        }
      }
      
      // Development: save to local public folder
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const publicPath = path.join(process.cwd(), 'public', 'new-images')
      await mkdir(publicPath, { recursive: true })
      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filepath = path.join(publicPath, filename)
      await writeFile(filepath, buffer)
      const url = `/new-images/${filename}`
      return NextResponse.json({ success: true, url, filename })
    }

    // For videos: only allow in development (or implement video hosting service later)
    if (type === 'video' || file.type.startsWith('video/')) {
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        return NextResponse.json({ 
          error: 'Video upload not supported in production. Please use external video URLs (YouTube, Vimeo, etc.) and paste the URL directly.',
          code: 'VIDEO_NOT_SUPPORTED'
        }, { status: 400 })
      }
      
      // Development only: save to public folder
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const publicPath = path.join(process.cwd(), 'public', 'video')
      await mkdir(publicPath, { recursive: true })
      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filepath = path.join(publicPath, filename)
      await writeFile(filepath, buffer)
      const url = `/video/${filename}`
      return NextResponse.json({ success: true, url, filename })
    }

    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  } catch (error: any) {
    console.error('[Home Upload API] Error uploading file:', error)
    const errorMessage = error?.message || 'Failed to upload file'
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}
