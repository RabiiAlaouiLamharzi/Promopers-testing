"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedReference } from "@/lib/reference-translations"
import type { Reference } from "@/lib/references"

export default function ReferencesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [references, setReferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchReferences()
  }, [])

  useEffect(() => {
    // Re-translate when language changes
    if (references.length > 0) {
      fetchReferences()
    }
  }, [language])

  const fetchReferences = async () => {
    try {
      const response = await fetch('/api/references')
      const data: Reference[] = await response.json()
      // Apply translations to all references
      const translated = data.map(ref => getTranslatedReference(ref, language))
      setReferences(translated)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching references:', error)
      setLoading(false)
    }
  }

  const itemsPerPage = 4
  const totalPages = Math.ceil(references.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const caseStudies = references.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <CaseStudiesSection 
        caseStudies={caseStudies} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        loading={loading}
        t={t}
      />
      <Footer />
    </div>
  )
}


// Helper function to get description for listing
function getDescriptionForListing(study: any) {
  if (Array.isArray(study.description) && study.description.length > 0) {
    return study.description[0]
  }
  return study.description || ''
}

function CaseStudiesSection({ 
  caseStudies, 
  currentPage, 
  setCurrentPage, 
  totalPages,
  loading,
  t 
}: { 
  caseStudies: any[]
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  loading: boolean
  t: (key: string) => string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (loading) {
    return (
      <section ref={sectionRef} className="py-32 bg-white">
        <div className="luxury-container text-center">
          <div className="text-[#121830] text-xl">Loading references...</div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="pt-32 pb-8 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFCE5C 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="luxury-container relative z-10">
        <div
          className={`mb-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-headline text-[#121830] uppercase break-words">
            {t("references.ourWorkWith")}
          </h2>
          <h3 className="text-subheadline text-[#2B2F36] uppercase break-words">
            {t("references.leadingBrands")}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => {
            const description = getDescriptionForListing(study)
            const truncatedDescription = description.length > 180 ? description.substring(0, 180) + '...' : description

            return (
              <div
                key={study.id || study.slug}
                className={`group transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Link href={`/references/${study.slug}`}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2 cursor-pointer">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={study.heroImage || study.image}
                        alt={study.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/70 via-[#121830]/20 to-transparent" />
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-3xl font-bold text-[#121830] uppercase tracking-tight mb-3">
                        {study.name}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                        {truncatedDescription}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="inline-flex items-center gap-1.5 text-[#121830] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                          {t("references.readMore")}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-16">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentPage === 1
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#121830] text-[#121830] hover:bg-[#121830] hover:text-white"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentPage === page ? "bg-[#121830] w-6" : "bg-gray-200 w-3"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentPage === totalPages
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#121830] text-[#121830] hover:bg-[#121830] hover:text-white"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

