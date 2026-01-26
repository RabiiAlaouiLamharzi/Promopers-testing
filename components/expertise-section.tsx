"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export function ExpertiseSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="relative min-h-[75vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img src="/modern-creative-office-workspace-with-team-collabo.jpg" alt="Modern workspace" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full">
        <div
          className={`max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-headline text-[#FFE500] mb-8 max-w-3xl text-balance uppercase">
            Connecting Brands with
            <br />
            Consumers, Face to Face
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
              Get Started
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
