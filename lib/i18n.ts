export type Language = 'en' | 'fr' | 'de' | 'it'

export const languages: Language[] = ['en', 'fr', 'de', 'it']

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
}

export const defaultLanguage: Language = 'en'

export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage
  
  const browserLang = navigator.language || (navigator as any).userLanguage || ''
  const langCode = browserLang.split('-')[0].toLowerCase()
  
  // Map browser language to our supported languages
  if (langCode === 'fr') return 'fr'
  if (langCode === 'de') return 'de'
  if (langCode === 'it') return 'it'
  
  return defaultLanguage
}

export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('language')
  return stored && languages.includes(stored as Language) ? (stored as Language) : null
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('language', lang)
}

