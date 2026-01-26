import { Reference, ReferenceTranslations } from './references'
import { Language } from './i18n'
import { translations as staticTranslations } from './translations'

/**
 * Get translated content for a reference
 * Priority: 1. Reference's stored translations, 2. Static translations.ts, 3. English fallback
 */
export function getTranslatedReference(
  reference: Reference,
  language: Language
): Reference {
  // English is the base language, no translation needed
  if (language === 'en') {
    return reference
  }

  const refTranslations = reference.translations?.[language]
  if (!refTranslations) {
    // Fallback to static translations.ts for backwards compatibility
    return getStaticTranslations(reference, language)
  }

  // Build translated reference from stored translations
  const translated: Reference = {
    ...reference,
    tagline: refTranslations.tagline || reference.tagline,
    description: refTranslations.description || reference.description,
    responsibilities: refTranslations.responsibilities || reference.responsibilities,
    additionalText: refTranslations.additionalText || reference.additionalText,
    services: refTranslations.services || reference.services,
    sectionTitle: refTranslations.sectionTitle || reference.sectionTitle,
    subheading: refTranslations.subheading || reference.subheading,
    additionalDescription: refTranslations.additionalDescription || reference.additionalDescription,
    responsibilitiesHeading: refTranslations.responsibilitiesHeading || reference.responsibilitiesHeading,
    tags: refTranslations.tags || reference.tags,
    location: refTranslations.location || reference.location,
  }

  return translated
}

/**
 * Fallback to static translations.ts for backwards compatibility
 */
function getStaticTranslations(reference: Reference, language: Language): Reference {
  const slugToKey: Record<string, string> = {
    'samsung': 'samsung',
    'coca-cola': 'cocaCola',
    'jbl': 'jbl',
    'arlo': 'arlo',
    'asus': 'asus'
  }
  
  const clientKey = slugToKey[reference.slug] || reference.slug.replace(/-/g, '')
  const langTranslations = staticTranslations[language]?.references?.[clientKey]
  
  if (!langTranslations) {
    return reference // No translation found, return English
  }

  const translated: Reference = {
    ...reference,
    tagline: langTranslations.tagline || reference.tagline,
  }

  // Translate descriptions
  if (reference.description && langTranslations.description1) {
    translated.description = reference.description.map((_, index) => {
      const key = `description${index + 1}` as keyof typeof langTranslations
      return (langTranslations[key] as string) || reference.description[index]
    })
  }

  // Translate services
  if (reference.services && langTranslations.service1) {
    translated.services = reference.services.map((_, index) => {
      const key = `service${index + 1}` as keyof typeof langTranslations
      return (langTranslations[key] as string) || reference.services![index]
    })
  }

  // Translate other fields
  translated.subheading = langTranslations.subheading || reference.subheading
  translated.sectionTitle = langTranslations.sectionTitle || reference.sectionTitle
  
  // Translate additional descriptions
  if (reference.additionalDescription && langTranslations.additionalDescription1) {
    translated.additionalDescription = reference.additionalDescription.map((_, index) => {
      const key = `additionalDescription${index + 1}` as keyof typeof langTranslations
      return (langTranslations[key] as string) || reference.additionalDescription![index]
    })
  }

  // Translate responsibilities
  if (reference.responsibilities && langTranslations.responsibility1) {
    translated.responsibilities = reference.responsibilities.map((_, index) => {
      const key = `responsibility${index + 1}` as keyof typeof langTranslations
      return (langTranslations[key] as string) || reference.responsibilities![index]
    })
    translated.responsibilitiesHeading = langTranslations.responsibilitiesHeading || reference.responsibilitiesHeading
  }

  // Translate additional text
  if (reference.additionalText) {
    if (Array.isArray(reference.additionalText)) {
      translated.additionalText = reference.additionalText.map((_, index) => {
        const key = `additionalText${index + 1}` as keyof typeof langTranslations
        return (langTranslations[key] as string) || reference.additionalText![index]
      })
    } else {
      translated.additionalText = (langTranslations.additionalText as string) || reference.additionalText
    }
  }

  return translated
}

