import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.JSONBIN_API_KEY,
    apiKeyLength: process.env.JSONBIN_API_KEY?.length || 0,
    apiKeyStart: process.env.JSONBIN_API_KEY?.substring(0, 10) || 'none',
    binId: process.env.JSONBIN_TRANSLATIONS_BIN_ID || 'not set',
  })
}

