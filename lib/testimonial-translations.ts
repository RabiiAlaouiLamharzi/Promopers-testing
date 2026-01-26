import { Testimonial, TestimonialTranslations } from './testimonials'
import { Language } from './i18n'

/**
 * Get translated content for a testimonial
 * Priority: 1. Testimonial's stored translations, 2. English fallback
 */
export function getTranslatedTestimonial(
  testimonial: Testimonial,
  language: Language
): Testimonial {
  // English is the base language, no translation needed
  if (language === 'en') {
    return testimonial
  }

  const testimonialTranslations = testimonial.translations?.[language]
  if (!testimonialTranslations) {
    return testimonial // No translation found, return English
  }

  // Build translated testimonial from stored translations
  const translated: Testimonial = {
    ...testimonial,
    quote: testimonialTranslations.quote || testimonial.quote,
    position: testimonialTranslations.position || testimonial.position,
  }

  return translated
}

