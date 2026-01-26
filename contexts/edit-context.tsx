"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useLanguage } from './language-context'

type Language = 'en' | 'fr' | 'de' | 'it'

interface EditContextType {
  editMode: boolean
  currentLanguage: Language
  setEditMode: (mode: boolean) => void
  setCurrentLanguage: (lang: Language) => void
}

const EditContext = createContext<EditContextType | null>(null)

export function EditProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  const { language, setLanguage } = useLanguage()
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(language)

  // Sync with main language context
  useEffect(() => {
    setCurrentLanguageState(language)
  }, [language])

  const setCurrentLanguage = (lang: Language) => {
    setCurrentLanguageState(lang)
    setLanguage(lang)
  }

  return (
    <EditContext.Provider value={{ editMode, currentLanguage, setEditMode, setCurrentLanguage }}>
      {children}
    </EditContext.Provider>
  )
}

export function useEdit() {
  const context = useContext(EditContext)
  if (!context) {
    return { editMode: false, currentLanguage: 'en' as Language, setEditMode: () => {}, setCurrentLanguage: () => {} }
  }
  return context
}

