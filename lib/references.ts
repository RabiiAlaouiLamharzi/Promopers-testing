import path from 'path'
import { readReferences, writeReferences } from './jsonbin-storage'

const LOCAL_FILE = path.join(process.cwd(), 'data', 'references.json')

export interface ReferenceTranslations {
  fr?: {
    tagline?: string
    description?: string[]
    responsibilities?: string[]
    additionalText?: string | string[]
    services?: string[]
    sectionTitle?: string
    subheading?: string
    additionalDescription?: string[]
    responsibilitiesHeading?: string
    tags?: string[]
    location?: string
  }
  de?: {
    tagline?: string
    description?: string[]
    responsibilities?: string[]
    additionalText?: string | string[]
    services?: string[]
    sectionTitle?: string
    subheading?: string
    additionalDescription?: string[]
    responsibilitiesHeading?: string
    tags?: string[]
    location?: string
  }
  it?: {
    tagline?: string
    description?: string[]
    responsibilities?: string[]
    additionalText?: string | string[]
    services?: string[]
    sectionTitle?: string
    subheading?: string
    additionalDescription?: string[]
    responsibilitiesHeading?: string
    tags?: string[]
    location?: string
  }
}

export interface Reference {
  id: string
  slug: string
  name: string
  tagline?: string
  heroImage: string
  logo?: string
  images?: string[] // Gallery images array
  description: string[]
  responsibilities?: string[]
  additionalText?: string | string[]
  services?: string[]
  sectionTitle?: string
  subheading?: string
  additionalDescription?: string[]
  responsibilitiesHeading?: string
  client: string
  location: string
  date: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  translations?: ReferenceTranslations
}

export async function getAllReferences(): Promise<Reference[]> {
  try {
    console.log(`[References] getAllReferences() - Reading from JSONBin.io`)
    const references = await readReferences<Reference[]>()
    
    // Ensure we always return an array
    let result: Reference[] = []
    if (Array.isArray(references)) {
      result = references
    } else if (references && typeof references === 'object') {
      // If it's a single object, wrap it in an array
      if ('slug' in references || 'id' in references) {
        result = [references as Reference]
      } else {
        // If it's an object with array properties, try to find the array
        const keys = Object.keys(references)
        for (const key of keys) {
          const value = (references as any)[key]
          if (Array.isArray(value)) {
            result = value
            break
          }
        }
      }
    }
    
    console.log(`[References] getAllReferences() - Retrieved ${result.length} references`)
    if (result.length > 0) {
      console.log(`[References] Reference slugs:`, result.map(r => r.slug))
    }
    return result
  } catch (error: any) {
    console.error('[References] Error reading references:', error?.message || error)
    // Return empty array to prevent app crash
    console.warn('[References] Returning empty array. Run POST /api/migrate to copy data to JSONBin.io')
    return []
  }
}

export async function getReferenceBySlug(slug: string, includeUnpublished: boolean = false): Promise<Reference | null> {
  const references = await getAllReferences()
  if (includeUnpublished) {
    return references.find(ref => ref.slug === slug) || null
  }
  return references.find(ref => ref.slug === slug && ref.published) || null
}

export async function saveReferences(references: Reference[]): Promise<void> {
  try {
    console.log(`[References] Attempting to save ${references.length} references to JSONBin.io`)
    await writeReferences(references)
    console.log(`[References] Successfully saved ${references.length} references to JSONBin.io`)
  } catch (error: any) {
    const errorMessage = error?.message || String(error)
    console.error('[References] Error saving references:', {
      message: errorMessage,
      stack: error?.stack,
      error: error,
      referencesCount: references.length
    })
    throw new Error(`Failed to save references: ${errorMessage}`)
  }
}

export async function createReference(reference: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reference> {
  try {
    console.log('[References] Creating new reference:', reference.slug)
    const references = await getAllReferences()
    const id = reference.slug
    const now = new Date().toISOString()
    
    const newReference: Reference = {
      ...reference,
      id,
      createdAt: now,
      updatedAt: now
    }
    
    references.push(newReference)
    console.log(`[References] Adding reference to array. Total references: ${references.length}`)
    await saveReferences(references)
    console.log('[References] Reference created successfully:', id)
    return newReference
  } catch (error: any) {
    console.error('[References] Error in createReference:', {
      slug: reference.slug,
      error: error?.message || String(error),
      stack: error?.stack
    })
    throw error
  }
}

export async function updateReference(slug: string, updates: Partial<Reference>): Promise<Reference | null> {
  const references = await getAllReferences()
  const index = references.findIndex(ref => ref.slug === slug)
  
  if (index === -1) return null
  
  references[index] = {
    ...references[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveReferences(references)
  return references[index]
}

export async function deleteReference(slug: string): Promise<boolean> {
  const references = await getAllReferences()
  const filtered = references.filter(ref => ref.slug !== slug)
  
  if (filtered.length === references.length) return false
  
  await saveReferences(filtered)
  return true
}

