"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useLanguage } from './language-context'

interface TextOverrides {
  [language: string]: {
    [key: string]: string
  }
}

interface TextOverridesContextType {
  overrides: TextOverrides
  setOverride: (key: string, value: string) => void
  getOverride: (key: string) => string | undefined
  saveOverrides: () => Promise<void>
  loadOverrides: () => Promise<void>
  isSaving: boolean
}

const TextOverridesContext = createContext<TextOverridesContextType | null>(null)

export function TextOverridesProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [overrides, setOverrides] = useState<TextOverrides>({})
  const [isSaving, setIsSaving] = useState(false)

  // Load overrides on mount and when language changes
  useEffect(() => {
    loadOverrides()
  }, [language]) // Reload when language changes

  const setOverride = (key: string, value: string) => {
    console.log('[TextOverrides] setOverride called:', { language, key, value })
    setOverrides(prev => {
      const updated = {
        ...prev,
        [language]: {
          ...prev[language],
          [key]: value,
        },
      }
      console.log('[TextOverrides] Updated overrides state:', updated)
      return updated
    })
  }

  const getOverride = (key: string): string | undefined => {
    return overrides[language]?.[key]
  }

  const saveOverrides = async () => {
    setIsSaving(true)
    try {
      console.log('[TextOverrides] 💾 Saving for language:', language)
      console.log('[TextOverrides] 📊 All overrides:', overrides)
      console.log('[TextOverrides] 📤 Data to save for current language:', overrides[language])
      console.log('[TextOverrides] 📝 Number of keys to save:', Object.keys(overrides[language] || {}).length)
      
      const dataToSend = {
        language,
        translations: overrides[language] || {},
      }
      console.log('[TextOverrides] 📨 Sending to API:', dataToSend)
      
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      const responseData = await response.json()
      console.log('[TextOverrides] 📥 API Response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to save: ${response.status}`)
      }

      console.log('[TextOverrides] ✅ Saved successfully to JSONBin')
    } catch (error) {
      console.error('[TextOverrides] ❌ Save error:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const loadOverrides = async () => {
    try {
      const response = await fetch('/api/translations')
      if (response.ok) {
        const data = await response.json()
        setOverrides(data)
        console.log('[TextOverrides] Loaded:', data)
      }
    } catch (error) {
      console.error('[TextOverrides] Load error:', error)
    }
  }

  return (
    <TextOverridesContext.Provider value={{
      overrides,
      setOverride,
      getOverride,
      saveOverrides,
      loadOverrides,
      isSaving,
    }}>
      {children}
    </TextOverridesContext.Provider>
  )
}

export function useTextOverrides() {
  const context = useContext(TextOverridesContext)
  if (!context) {
    return {
      overrides: {},
      setOverride: () => {},
      getOverride: () => undefined,
      saveOverrides: async () => {},
      loadOverrides: async () => {},
      isSaving: false,
    }
  }
  return context
}

