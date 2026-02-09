'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, detectBrowserLanguage, getStoredLanguage, setStoredLanguage, defaultLanguage } from '@/lib/i18n'
import { translations } from '@/lib/translations'

// Global overrides loaded from API
let globalOverrides: any = {}

// Helper function to get translation value with overrides support
const getTranslationValue = (key: string, lang: Language, overrides: any = {}): string => {
  // AGGRESSIVE FIX: Special handling for testimonials.description - check both keys
  if (key === 'testimonials.description') {
    // Check overrides for both keys
    const descOverride = overrides[lang]?.['testimonials.description']
    const subtitleOverride = overrides[lang]?.['testimonials.subtitle']
    
    if (descOverride) return descOverride
    if (subtitleOverride) return subtitleOverride
    
    // Then check default translations
    const keys = key.split('.')
    let value: any = translations[lang]
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    
    // If not found, try subtitle in default translations
    if (value === undefined || typeof value !== 'string') {
      const subtitleKeys = 'testimonials.subtitle'.split('.')
      let subtitleValue: any = translations[lang]
      for (const k of subtitleKeys) {
        subtitleValue = subtitleValue?.[k]
        if (subtitleValue === undefined) break
      }
      if (subtitleValue && typeof subtitleValue === 'string') {
        return subtitleValue
      }
    }
    
    // Fallback to English
    if (value === undefined || typeof value !== 'string') {
      value = translations[defaultLanguage]
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) break
      }
    }
    
    return typeof value === 'string' ? value : key
  }
  
  // Floating features description: also accept overrides saved under floatingFeatures.subtitle (legacy)
  if (key === 'floatingFeatures.description') {
    const descOverride = overrides[lang]?.['floatingFeatures.description']
    const subtitleOverride = overrides[lang]?.['floatingFeatures.subtitle']
    if (descOverride) return descOverride
    if (subtitleOverride) return subtitleOverride
  }

  // AGGRESSIVE FIX: Map contactCta.* to contact.* keys
  const contactCtaMapping: Record<string, string> = {
    'contact.readyToWork': 'contactCta.title',
    'contact.discussBrand': 'contactCta.description',
    'contact.scheduleCall': 'contactCta.buttonText'
  }
  
  if (contactCtaMapping[key]) {
    // Check overrides for both keys
    const contactOverride = overrides[lang]?.[key]
    const contactCtaOverride = overrides[lang]?.[contactCtaMapping[key]]
    
    if (contactOverride) return contactOverride
    if (contactCtaOverride) return contactCtaOverride
    
    // Then check default translations
    const keys = key.split('.')
    let value: any = translations[lang]
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    
    // If not found, try contactCta key in default translations
    if (value === undefined || typeof value !== 'string') {
      const contactCtaKeys = contactCtaMapping[key].split('.')
      let contactCtaValue: any = translations[lang]
      for (const k of contactCtaKeys) {
        contactCtaValue = contactCtaValue?.[k]
        if (contactCtaValue === undefined) break
      }
      if (contactCtaValue && typeof contactCtaValue === 'string') {
        return contactCtaValue
      }
    }
    
    // Fallback to English
    if (value === undefined || typeof value !== 'string') {
      value = translations[defaultLanguage]
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) break
      }
    }
    
    return typeof value === 'string' ? value : key
  }
  
  // Check overrides first
  const overrideValue = overrides[lang]?.[key]
  if (overrideValue) {
    return overrideValue
  }

  // Then check default translations
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English if translation missing
      value = translations[defaultLanguage]
      for (const k2 of keys) {
        value = value?.[k2]
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  revision: number
  mediaOverrides: Record<string, any>
  reloadOverrides: () => Promise<void>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)
  const [revision, setRevision] = useState(0)
  const [overrides, setOverrides] = useState<any>({})
  const [mediaOverrides, setMediaOverrides] = useState<Record<string, any>>({})

  useEffect(() => {
    // Detect language on mount
    const stored = getStoredLanguage()
    const detected = detectBrowserLanguage()
    const initialLang = stored || detected
    setLanguageState(initialLang)
    
    // Load translation overrides from API
    Promise.all([
      fetch('/api/translations').then(res => res.json()),
      fetch('/api/media').then(res => res.json())
    ])
      .then(([translationsData, mediaData]) => {
        setOverrides(translationsData)
        globalOverrides = translationsData
        console.log('[Language] Loaded translation overrides:', translationsData)
        
        // Extract media overrides (excluding metadata)
        const { updatedAt, description, ...media } = mediaData
        setMediaOverrides(media)
        console.log('[Language] Loaded media overrides:', media)
        
        // Increment revision to trigger re-renders
        setRevision(prev => prev + 1)
      })
      .catch(err => console.error('[Language] Failed to load overrides:', err))
      .finally(() => setMounted(true))
  }, [])

  const setLanguage = (lang: Language) => {
    console.log('Language changing to:', lang)
    setLanguageState(lang)
    setStoredLanguage(lang)
    // Increment revision to force re-renders
    setRevision(prev => prev + 1)
    // Force a window-level event to ensure all components update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }))
    }
  }

  const t = (key: string): string => {
    return getTranslationValue(key, language, overrides)
  }

  const reloadOverrides = async () => {
    try {
      console.log('[Language] 🔄 Reloading overrides...')
      const response = await fetch('/api/translations')
      if (response.ok) {
        const translationsData = await response.json()
        console.log('[Language] 📥 Received from API:', translationsData)
        console.log('[Language] 📊 Current language:', language)
        console.log('[Language] 📝 Overrides for current language:', translationsData[language])
        
        setOverrides(translationsData)
        globalOverrides = translationsData
        
        const oldRevision = revision
        setRevision(prev => {
          const newRev = prev + 1
          console.log('[Language] 🔢 Revision incremented:', oldRevision, '→', newRev)
          return newRev
        })
        
        console.log('[Language] ✅ Overrides reloaded and revision incremented')
      } else {
        console.error('[Language] ❌ Failed to fetch overrides:', response.status)
      }
    } catch (error) {
      console.error('[Language] ❌ Failed to reload overrides:', error)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, revision, mediaOverrides, reloadOverrides }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  
  // During SSR or when context is not available, return default values
  if (context === undefined) {
    return {
      language: defaultLanguage,
      setLanguage: () => {},
      t: (key: string) => getTranslationValue(key, defaultLanguage, globalOverrides),
      revision: 0,
      mediaOverrides: {},
      reloadOverrides: async () => {}
    }
  }
  
  return context
}

