import { NextRequest, NextResponse } from 'next/server'
import { getHomePageContent, saveHomePageContent } from '@/lib/home'
import type { HomePageContent } from '@/lib/home'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    let homeContent = await getHomePageContent()
    
    // If no content from API/storage, try reading local file
    if (!homeContent) {
      try {
        const filePath = path.join(process.cwd(), 'data', 'home.json')
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8')
          homeContent = JSON.parse(fileContent)
          console.log('[Home API] Using local file as fallback')
        }
      } catch (error) {
        console.error('[Home API] Error reading local file:', error)
      }
    }
    
    // If still no content, return error (the file should always exist now)
    if (!homeContent) {
      return NextResponse.json({ error: 'Home page content not found' }, { status: 404 })
    }
    
    return NextResponse.json(homeContent)
  } catch (error) {
    console.error('Error fetching home page content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const content: HomePageContent = {
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    await saveHomePageContent(content)
    
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error saving home page content:', error)
    return NextResponse.json({ error: 'Failed to save home page content' }, { status: 500 })
  }
}
