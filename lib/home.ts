import path from 'path'
import fs from 'fs'
import { readJsonFromBin, writeJsonToBin } from './jsonbin-storage'

const LOCAL_FILE = path.join(process.cwd(), 'data', 'home.json')
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY

export interface SectionTranslations {
  fr?: { [key: string]: string }
  de?: { [key: string]: string }
  it?: { [key: string]: string }
}

export interface HeroSectionData {
  videoUrl: string
  titleLine1: string
  titleLine2: string
  titleLine3: string
  description: string
  buttonText: string
  buttonLink: string
  overlayOpacity: number
  logos: string[]
  translations?: SectionTranslations
}

export interface FloatingFeaturesSectionData {
  title: string
  titleHighlight: string
  description: string
  features: {
    icon: string
    title: string
    description: string
  }[]
  translations?: SectionTranslations
}

export interface AboutSectionData {
  title: string
  titleHighlight: string
  description: string
  buttonText: string
  factors: {
    icon: string
    title: string
    description: string
    badge: string
  }[]
  translations?: SectionTranslations
}

export interface StatsSectionData {
  stats: {
    number: string
    label: string
    description: string
  }[]
  translations?: SectionTranslations
}

export interface ContactCTASectionData {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  translations?: SectionTranslations
}

export interface HomePageContent {
  id: string
  hero: HeroSectionData
  floatingFeatures: FloatingFeaturesSectionData
  about: AboutSectionData
  stats: StatsSectionData
  contactCTA: ContactCTASectionData
  updatedAt: string
}

const HOME_BIN_ID = process.env.JSONBIN_HOME_BIN_ID || '69369e93home881f401a6001'

export async function getHomePageContent(): Promise<HomePageContent | null> {
  try {
    // Try JSONBin first if API key is configured
    if (JSONBIN_API_KEY) {
      try {
        const data = await readJsonFromBin<HomePageContent>(HOME_BIN_ID)
        if (data) {
          console.log('[Home] Loaded from JSONBin')
          return data
        }
      } catch (error) {
        console.warn('[Home] JSONBin failed, trying local file:', error)
      }
    }
    
    // Fallback to local file
    if (fs.existsSync(LOCAL_FILE)) {
      const fileContent = fs.readFileSync(LOCAL_FILE, 'utf8')
      const data = JSON.parse(fileContent)
      console.log('[Home] Loaded from local file')
      return data
    }
    
    console.warn('[Home] No content found')
    return null
  } catch (error) {
    console.error('Error reading home page content:', error)
    return null
  }
}

export async function saveHomePageContent(content: HomePageContent): Promise<void> {
  try {
    // Save to local file first (always)
    const dir = path.dirname(LOCAL_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(content, null, 2))
    console.log(`[Home] Saved home page content to local file`)
    
    // Try to save to JSONBin if configured
    if (JSONBIN_API_KEY) {
      try {
        await writeJsonToBin(HOME_BIN_ID, content)
        console.log(`[Home] Saved home page content to JSONBin.io`)
      } catch (error) {
        console.warn('[Home] Failed to save to JSONBin, but local file saved:', error)
      }
    }
  } catch (error) {
    console.error('Error saving home page content:', error)
    throw new Error('Failed to save home page content')
  }
}
