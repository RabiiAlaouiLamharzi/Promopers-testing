"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export function IntroSection() {
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
    <section ref={sectionRef} className="py-32 px-6 md:px-16 lg:px-24 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[auto_1fr] gap-16 items-start">
          {/* Icon */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-black">
                <path
                  d="M30 10L10 20L30 30L50 20L30 10Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 40L30 50L50 40"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 30L30 40L50 30"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="space-y-6 mb-8">
              <p className="text-base leading-relaxed text-gray-700 max-w-2xl">
                PromoPers delivers exceptional POS retail activations and experiential marketing solutions.
              </p>
              <p className="text-base leading-relaxed text-gray-700 max-w-2xl">
                We specialize in connecting brands with consumers through strategic retail activations and memorable brand experiences in Switzerland.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/references" className="px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="currentColor" />
                  <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1" />
                </svg>
                POS Activations
              </Link>
              <Link href="/references" className="px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" />
                  <path d="M8 10c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" fill="currentColor" />
                </svg>
                Brand Events
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L2 4v6l6 3 6-3V4l-6-3z" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M6 8l2 2 4-4" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
