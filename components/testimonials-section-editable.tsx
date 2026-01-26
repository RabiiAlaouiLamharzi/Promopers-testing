"use client"

import { useEffect, useRef, useState } from "react"
import { Quote } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useEdit } from "@/contexts/edit-context"
import { EditableText } from "@/components/editable-text"
import { getTranslatedTestimonial } from "@/lib/testimonial-translations"
import type { Testimonial } from "@/lib/testimonials"

export function TestimonialsSectionEditable() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language, revision } = useLanguage()
  const { editMode } = useEdit()

  const [title, setTitle] = useState(t("testimonials.title"))
  const [titleHighlight, setTitleHighlight] = useState(t("testimonials.titleHighlight"))
  const [description, setDescription] = useState(t("testimonials.description"))

  // Update translations when language changes
  useEffect(() => {
    setTitle(t("testimonials.title"))
    setTitleHighlight(t("testimonials.titleHighlight"))
    setDescription(t("testimonials.description"))
  }, [t, language, revision])

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
      } else {
        console.error('Failed to fetch testimonials:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  // Reset to first testimonial when language changes
  useEffect(() => {
    if (testimonials.length > 0) {
      setCurrentTestimonial(0)
    }
  }, [language])

  // Get translated testimonials
  const translatedTestimonials = testimonials.length > 0 
    ? testimonials.map(t => getTranslatedTestimonial(t, language))
    : []

  // Ensure currentTestimonial is within bounds
  useEffect(() => {
    if (translatedTestimonials.length > 0 && currentTestimonial >= translatedTestimonials.length) {
      setCurrentTestimonial(0)
    }
  }, [translatedTestimonials.length, currentTestimonial])

  const nextTestimonial = () => {
    if (translatedTestimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev + 1) % translatedTestimonials.length)
    }
  }

  const goToTestimonial = (index: number) => {
    if (index >= 0 && index < translatedTestimonials.length) {
      setCurrentTestimonial(index)
    }
  }

  // Get current testimonial with safe index
  const safeIndex = translatedTestimonials.length > 0 
    ? Math.max(0, Math.min(currentTestimonial, translatedTestimonials.length - 1))
    : 0
  const current = translatedTestimonials[safeIndex]

  return (
    <section ref={sectionRef} className="luxury-section bg-white pt-0">
      <div className="luxury-container">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16 mt-0">
          {/* Left: Title */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <h2 className="text-headline text-[#002855] mb-6 uppercase">
              <EditableText
                value={title}
                onChange={setTitle}
                translationKey="testimonials.title"
                editMode={editMode}
                className="text-headline text-[#002855] uppercase"
              />
              <br />
              <span className="text-[#003D7A]">
                <EditableText
                  value={titleHighlight}
                  onChange={setTitleHighlight}
                  translationKey="testimonials.titleHighlight"
                  editMode={editMode}
                  className="text-headline text-[#003D7A] uppercase"
                />
              </span>
            </h2>
          </div>

          {/* Right: Description & CTA */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-luxury-body text-[#003D7A] leading-relaxed">
              <EditableText
                value={description}
                onChange={setDescription}
                translationKey="testimonials.description"
                editMode={editMode}
                multiline
                as="span"
                className="text-luxury-body text-[#003D7A] leading-relaxed"
              />
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 items-center gap-8 lg:gap-16">
            <div className="relative max-[1000px]:hidden">
              <div className="relative rounded-3xl overflow-hidden premium-shadow bg-gray-200 animate-pulse h-[600px]" />
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
          className={`grid grid-cols-1 min-[1000px]:grid-cols-2 items-center gap-8 lg:gap-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Left: Author Image */}
          <div className="relative max-[1000px]:hidden">
            <div className="relative rounded-3xl overflow-hidden premium-shadow">
              <img
                src={current.image}
                alt={current.author}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Overlay Text */}
              <div className="absolute bottom-8 left-8">
                <div className="bg-[#FFC72C] text-black px-6 py-3 rounded-2xl font-bold text-lg max-w-xs">
                  {t("testimonials.trustedByBrands")}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Testimonial */}
          <div className="relative">
            <div className="relative">
              {/* Large Quote Mark */}
              <Quote className="absolute -top-8 -left-4 w-24 h-24 text-[#FFC72C] opacity-20" />
              
              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl lg:text-2xl text-[#002855] leading-relaxed mb-8 relative z-10 pl-16">
                "{current.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4 pl-16">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={current.authorImage}
                    alt={current.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-[#002855] mb-1">{current.author}</h4>
                  <p className="text-[#003D7A] text-sm">{current.position}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
            {translatedTestimonials.length > 1 && (
        <div className="flex justify-center mt-12 gap-3">
          {translatedTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? "bg-[#002855] scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
            )}
          </>
        )}

        {/* No testimonials state */}
        {!loading && !current && translatedTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#003D7A] text-lg">No testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

