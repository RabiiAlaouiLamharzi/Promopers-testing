"use client"

import { useEffect, useRef, useState } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedTestimonial } from "@/lib/testimonial-translations"
import type { Testimonial } from "@/lib/testimonials"

const CUSTOMER_LOGOS = [
  "/new-images/logo-n2.png",
  "/new-images/logo-n3.png",
  "/new-images/logo-n4.png",
  "/new-images/logo-n5.png",
  "/new-images/logo-n9.png",
  "/new-images/logo-n10.png",
  "/new-images/logo-n11.png",
  "/new-images/logo-n12.png",
  "/new-images/logo-n13.png",
  "/new-images/logo-n14.png",
  "/new-images/logo-n15.png",
  "/new-images/logo-n16.png",
  "/new-images/logo-n19.png",
  "/new-images/samsung-logo.png",
]

function LogoScroller() {
  const duplicated = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS]

  return (
    <div className="relative overflow-hidden" style={{ paddingTop: "2rem" }}>
      <div
        className="flex items-center gap-12"
        style={{
          animation: "scroll-logos 40s linear infinite",
          width: "max-content",
        }}
      >
        {duplicated.map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 100, height: 52 }}
          >
            <img
              src={logo}
              alt="customer logo"
              className="max-w-full max-h-full object-contain opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-logos {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState<"left" | "right">("left")
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchTestimonials()
  }, [])

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

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data: Testimonial[] = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (testimonials.length > 0) {
      setCurrentTestimonial(0)
    }
  }, [language])


  const translatedTestimonials = testimonials.length > 0
    ? testimonials.map(t => getTranslatedTestimonial(t, language))
    : []


  useEffect(() => {
    if (translatedTestimonials.length > 0 && currentTestimonial >= translatedTestimonials.length) {
      setCurrentTestimonial(0)
    }
  }, [translatedTestimonials.length, currentTestimonial])

  const goToTestimonial = (index: number, dir: "left" | "right" = "left") => {
    if (index < 0 || index >= translatedTestimonials.length || animating) return
    setSlideDir(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrentTestimonial(index)
      setAnimating(false)
    }, 350)
  }

  const safeIndex = translatedTestimonials.length > 0
    ? Math.max(0, Math.min(currentTestimonial, translatedTestimonials.length - 1))
    : 0
  const current = translatedTestimonials[safeIndex]

  const prev = () => {
    const idx = safeIndex === 0 ? translatedTestimonials.length - 1 : safeIndex - 1
    goToTestimonial(idx, "right")
  }

  const next = () => {
    const idx = (safeIndex + 1) % translatedTestimonials.length
    goToTestimonial(idx, "left")
  }

  return (
    <section ref={sectionRef} className="luxury-section bg-white pt-0">
      <div className="luxury-container">
        {/* Header — same style as works/about sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16 mt-0">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <h2 className="text-headline text-[#002855] mb-6 uppercase">
              {t("testimonials.title")}
              <br />
              <span className="text-[#003D7A]">{t("testimonials.titleHighlight")}</span>
            </h2>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-luxury-body text-[#003D7A] leading-relaxed">
              {t("testimonials.description")}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 items-center gap-8 lg:gap-16">
            <div className="relative max-[1000px]:hidden">
              <div className="relative rounded-3xl overflow-hidden premium-shadow bg-gray-200 animate-pulse h-48" />
            </div>
            <div className="relative">
              <div className="space-y-4 pl-16">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-4/6" />
              </div>
            </div>
          </div>
        )}

        {/* Testimonial Content */}
        {!loading && current && (
          <>
            <div
              className={`grid grid-cols-1 min-[1000px]:grid-cols-[1fr_2fr] items-center gap-8 lg:gap-16 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "400ms", overflow: "hidden" }}
            >
              {/* Left: Brand logo matching testimonial index (1/3 width) */}
              <div
                className="relative max-[1000px]:hidden flex items-center justify-center"
                style={{
                  minHeight: 260,
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  opacity: animating ? 0 : 1,
                  transform: animating
                    ? `translateX(${slideDir === "left" ? "-40px" : "40px"})`
                    : "translateX(0)",
                }}
              >
                {[
                    "/new-images/harman-brand-logo.svg",
                  "/new-images/coca-cola-brand-logo.png",
                  "/new-images/samsung-logo.png",
                ][safeIndex] && (
                  <img
                    src={[
                      "/new-images/harman-brand-logo.svg",
                      "/new-images/coca-cola-brand-logo.png",
                      "/new-images/samsung-logo.png",
                    ][safeIndex]}
                    alt="brand logo"
                    className={`object-contain ${safeIndex === 2 ? "w-full scale-150" : "w-full max-h-[220px]"}`}
                  />
                )}
              </div>

              {/* Right: Testimonial quote */}
              <div
                className="relative"
                style={{
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  opacity: animating ? 0 : 1,
                  transform: animating
                    ? `translateX(${slideDir === "left" ? "40px" : "-40px"})`
                    : "translateX(0)",
                }}
              >
                <div className="relative">
                  <Quote className="absolute -top-8 -left-4 w-24 h-24 text-[#FFC72C] opacity-20" />

                  <blockquote className="text-lg md:text-xl lg:text-2xl text-[#002855] leading-relaxed mb-8 relative z-10 pl-16 text-justify">
                    "{current.quote}"
                  </blockquote>

                  <div className="flex items-center justify-between pl-16">
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={current.authorImage}
                          alt={current.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[#002855] mb-0.5">{current.author}</h4>
                        <p className="text-[#003D7A] text-sm">{current.position}</p>
                      </div>
                    </div>

                    {/* Arrows + dots on the right */}
                    {translatedTestimonials.length > 1 && (
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <button
                          onClick={prev}
                          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#002855] hover:bg-[#002855] hover:text-white hover:border-[#002855] transition-all duration-300"
                          aria-label="Previous testimonial"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                          {translatedTestimonials.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToTestimonial(index, index > safeIndex ? "left" : "right")}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === safeIndex ? "bg-[#002855] w-6" : "bg-gray-200 w-3 hover:bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={next}
                          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#002855] hover:bg-[#002855] hover:text-white hover:border-[#002855] transition-all duration-300"
                          aria-label="Next testimonial"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </>
        )}

        {/* No testimonials */}
        {!loading && !current && translatedTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#003D7A] text-lg">No testimonials available at the moment.</p>
          </div>
        )}
      </div>

      {/* Separator line with space above */}
      <div className="luxury-container" style={{ marginTop: "3rem" }}>
        <div className="border-t border-gray-100" />
      </div>

      {/* Customer logo infinity scroller */}
      <div
        className={`luxury-container transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <LogoScroller />
      </div>
    </section>
  )
}
