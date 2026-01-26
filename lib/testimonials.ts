import path from 'path'
import { readTestimonials, writeTestimonials } from './jsonbin-storage'

const LOCAL_FILE = path.join(process.cwd(), 'data', 'testimonials.json')

export interface TestimonialTranslations {
  fr?: {
    quote?: string
    position?: string
  }
  de?: {
    quote?: string
    position?: string
  }
  it?: {
    quote?: string
    position?: string
  }
}

export interface Testimonial {
  id: string
  author: string
  position: string
  quote: string
  image: string
  authorImage: string
  order: number
  published: boolean
  createdAt: string
  updatedAt: string
  translations?: TestimonialTranslations
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    return await readTestimonials<Testimonial[]>()
  } catch (error) {
    console.error('Error reading testimonials:', error)
    return []
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const testimonials = await getAllTestimonials()
  return testimonials.find(testimonial => testimonial.id === id) || null
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<void> {
  try {
    await writeTestimonials(testimonials)
    console.log(`[Testimonials] Saved ${testimonials.length} testimonials to JSONBin.io`)
  } catch (error) {
    console.error('Error saving testimonials:', error)
    throw new Error('Failed to save testimonials')
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> {
  const testimonials = await getAllTestimonials()
  const id = `testimonial-${Date.now()}`
  const now = new Date().toISOString()
  
  const newTestimonial: Testimonial = {
    ...testimonial,
    id,
    createdAt: now,
    updatedAt: now
  }
  
  testimonials.push(newTestimonial)
  await saveTestimonials(testimonials)
  return newTestimonial
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  const testimonials = await getAllTestimonials()
  const index = testimonials.findIndex(testimonial => testimonial.id === id)
  
  if (index === -1) return null
  
  testimonials[index] = {
    ...testimonials[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveTestimonials(testimonials)
  return testimonials[index]
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const testimonials = await getAllTestimonials()
  const filtered = testimonials.filter(testimonial => testimonial.id !== id)
  
  if (filtered.length === testimonials.length) return false
  
  await saveTestimonials(filtered)
  return true
}

