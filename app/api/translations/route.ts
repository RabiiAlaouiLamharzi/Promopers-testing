import { NextRequest, NextResponse } from 'next/server'
import { readJsonFromBin, writeJsonToBin } from '@/lib/jsonbin-storage'

const TRANSLATIONS_BIN_ID = process.env.JSONBIN_TRANSLATIONS_BIN_ID || '694c8bb843b1c97be9038b77'

export async function GET(request: NextRequest) {
  try {
    const overrides = await readJsonFromBin<any>(TRANSLATIONS_BIN_ID)
    return NextResponse.json(overrides || {})
  } catch (error) {
    console.error('[Translations API] Error reading:', error)
    return NextResponse.json({})
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Translations API] POST received')
    console.log('[Translations API] API Key present:', !!process.env.JSONBIN_API_KEY)
    console.log('[Translations API] Bin ID:', TRANSLATIONS_BIN_ID)
    
    const body = await request.json()
    const { language, translations } = body
    
    console.log('[Translations API] Language:', language)
    console.log('[Translations API] Translations:', translations)
    
    if (!language || !translations) {
      console.error('[Translations API] Missing required fields')
      return NextResponse.json(
        { error: 'Language and translations are required' },
        { status: 400 }
      )
    }
    
    // Get existing overrides
    let overrides: any = {}
    try {
      console.log('[Translations API] Reading existing overrides...')
      overrides = await readJsonFromBin<any>(TRANSLATIONS_BIN_ID) || {}
      console.log('[Translations API] Existing overrides:', overrides)
    } catch (error: any) {
      console.log('[Translations API] No existing overrides, creating new:', error?.message)
    }
    
    // AGGRESSIVE FIX: Sync testimonials.description and testimonials.subtitle
    // Also sync contactCta.* to contact.* keys
    const normalizedTranslations = { ...translations }
    
    // Sync testimonials keys
    if (normalizedTranslations['testimonials.description'] || normalizedTranslations['testimonials.subtitle']) {
      const value = normalizedTranslations['testimonials.description'] || normalizedTranslations['testimonials.subtitle']
      if (value) {
        console.log('[Translations API POST] 🔄 SYNCING testimonials keys:', value.substring(0, 50))
        normalizedTranslations['testimonials.description'] = value
        normalizedTranslations['testimonials.subtitle'] = value
      }
    }
    
    // Sync contactCta.* to contact.* keys
    if (normalizedTranslations['contactCta.title']) {
      normalizedTranslations['contact.readyToWork'] = normalizedTranslations['contactCta.title']
    }
    if (normalizedTranslations['contactCta.description']) {
      normalizedTranslations['contact.discussBrand'] = normalizedTranslations['contactCta.description']
    }
    if (normalizedTranslations['contactCta.buttonText']) {
      normalizedTranslations['contact.scheduleCall'] = normalizedTranslations['contactCta.buttonText']
    }
    
    // Also sync contact.* to contactCta.* for backwards compatibility
    if (normalizedTranslations['contact.readyToWork'] && !normalizedTranslations['contactCta.title']) {
      normalizedTranslations['contactCta.title'] = normalizedTranslations['contact.readyToWork']
    }
    if (normalizedTranslations['contact.discussBrand'] && !normalizedTranslations['contactCta.description']) {
      normalizedTranslations['contactCta.description'] = normalizedTranslations['contact.discussBrand']
    }
    if (normalizedTranslations['contact.scheduleCall'] && !normalizedTranslations['contactCta.buttonText']) {
      normalizedTranslations['contactCta.buttonText'] = normalizedTranslations['contact.scheduleCall']
    }
    
    // Merge new translations with existing overrides for this language
    overrides[language] = {
      ...overrides[language],
      ...normalizedTranslations,
    }
    
    overrides.updatedAt = new Date().toISOString()
    
    console.log('[Translations API] Saving to JSONBin...')
    // Save to JSONBin
    await writeJsonToBin(TRANSLATIONS_BIN_ID, overrides)
    console.log('[Translations API] Successfully saved!')
    
    return NextResponse.json({ success: true, overrides })
  } catch (error: any) {
    console.error('[Translations API] Error saving:', error)
    console.error('[Translations API] Error details:', error?.message, error?.stack)
    return NextResponse.json(
      { error: 'Failed to save translations', details: error?.message },
      { status: 500 }
    )
  }
}

