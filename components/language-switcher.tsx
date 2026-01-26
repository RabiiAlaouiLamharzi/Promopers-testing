'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { languages, languageNames, Language } from '@/lib/i18n'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  isInHero?: boolean
}

export function LanguageSwitcher({ isInHero = true }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isInHero
            ? "border border-white/30 text-white bg-transparent"
            : "border border-[#002855]/30 text-[#002855] bg-transparent"
        }`}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  language === lang
                    ? 'bg-[#002855] text-white font-semibold'
                    : 'text-[#002855] hover:bg-[#002855]/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{languageNames[lang]}</span>
                  <span className={`text-xs uppercase ${
                    language === lang ? 'text-white/70' : 'text-[#002855]/50'
                  }`}>{lang}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

