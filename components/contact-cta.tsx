"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function ContactCTA() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            {t("contact.readyToWork")}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("contact.discussBrand")}
          </p>

          {/* CTA Button */}
          <Link href="/contact" className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors flex items-center gap-3 mx-auto inline-flex w-auto">
            SCHEDULE CALL
            <ArrowRight className="w-5 h-5 text-[#002855]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
