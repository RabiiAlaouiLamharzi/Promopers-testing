"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useEdit } from "@/contexts/edit-context"
import { EditableText } from "@/components/editable-text"

export function ContactCTAEditable() {
  const { t, language, revision } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { editMode } = useEdit()
  
  // Editable state
  const [title, setTitle] = useState(t("contactCta.title"))
  const [description, setDescription] = useState(t("contactCta.description"))
  const [buttonText, setButtonText] = useState(t("contactCta.buttonText"))

  // Update translations when language changes or overrides are loaded
  useEffect(() => {
    const newTitle = t("contactCta.title")
    const newDescription = t("contactCta.description")
    const newButtonText = t("contactCta.buttonText")
    
    console.log('[ContactCTA] Updating translations:', { 
      revision, 
      language, 
      title: newTitle, 
      description: newDescription,
      buttonText: newButtonText 
    })
    
    setTitle(newTitle)
    setDescription(newDescription)
    setButtonText(newButtonText)
  }, [t, language, revision])

  useEffect(() => {
    setIsMounted(true)
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className={`text-center ${
          isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } transition-all duration-1500`}>
          {/* Main Heading */}
          <EditableText
            value={title}
            onChange={setTitle}
            translationKey="contactCta.title"
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase"
            editMode={editMode}
          />

          {/* Subtitle */}
          <EditableText
            value={description}
            onChange={setDescription}
            translationKey="contactCta.description"
            as="p"
            multiline
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            editMode={editMode}
          />

          {/* CTA Button */}
          <Link 
            href="/contact" 
            onClick={(e) => {
              if (editMode) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors flex items-center gap-3 mx-auto inline-flex w-auto"
          >
            <EditableText
              value={buttonText}
              onChange={setButtonText}
              translationKey="contactCta.buttonText"
              className="font-semibold"
              editMode={editMode}
            />
            <ArrowRight className="w-5 h-5 text-[#002855]" />
          </Link>
        </div>
      </div>
    </section>
  )
}

