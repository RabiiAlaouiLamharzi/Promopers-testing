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
      <HeroSection />
      <CaseStudiesSection 
        caseStudies={caseStudies} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        loading={loading}
        t={t}
      />
      <CTASection t={t} />
      <Footer />
    </div>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Subtle Luxury Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFC72C]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 luxury-container text-center px-6">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-[#FFC72C] bg-white/5 mt-16">
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("references.ourWork")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">{t("references.references")}</span>
          </h1>
          
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
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
          <div className="text-[#002855] text-xl">Loading references...</div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="luxury-container relative z-10">
        <div
          className={`mb-24 transition-all duration-1000 max-w-5xl mx-auto text-center ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#002855] mb-6 tracking-tight uppercase">
            {t("references.ourWorkWith")}
            <br />
            <span className="font-black text-[#FFC72C]">{t("references.leadingBrands")}</span>
          </h2>
          
          <div className="w-20 h-px bg-[#FFC72C] mx-auto mb-8" />
          
          <p className="text-lg md:text-xl text-[#003D7A]/80 font-light max-w-2xl mx-auto leading-relaxed">
            {t("references.longTermPartnerships")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {caseStudies.map((study, index) => {
            const description = getDescriptionForListing(study)
            const truncatedDescription = description.length > 200 ? description.substring(0, 200) + '...' : description

            return (
              <div
                key={study.id || study.slug}
                className={`group transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Link href={`/references/${study.slug}`}>
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2 cursor-pointer">
                    {/* Gold accent border on hover */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#FFC72C]/30 transition-all duration-500 pointer-events-none" />
                    
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={study.heroImage || study.image}
                        alt={study.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/80 via-[#002855]/20 to-transparent" />
                      
                      {/* Title overlay on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                          {study.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-10 flex-grow flex flex-col bg-gradient-to-b from-white to-gray-50/30">
                      <p className="text-[#003D7A] leading-relaxed text-base mb-8 flex-grow">
                        {truncatedDescription}
                      </p>
                      <div className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFC72C] text-[#002855] font-bold hover:bg-[#E6B526] group-hover:gap-4 transition-all duration-300 shadow-lg shadow-[#FFC72C]/30">
                        {t("references.readMore")}
                        <ArrowRight className="w-5 h-5 text-[#002855]" />
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
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                currentPage === 1
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#FFC72C] text-[#FFC72C] hover:bg-[#FFC72C] hover:text-[#002855]"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-[#FFC72C] text-[#002855] shadow-lg shadow-[#FFC72C]/30"
                      : "border-2 border-gray-300 text-gray-600 hover:border-[#FFC72C] hover:text-[#FFC72C]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#FFC72C] text-[#FFC72C] hover:bg-[#FFC72C] hover:text-[#002855]"
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

function CTASection({ t }: { t: (key: string) => string }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
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
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className={`text-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } transition-all duration-1500`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            {t("contact.readyToWork")}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("contact.discussBrand")}
          </p>

          <Link href="/contact" className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors flex items-center gap-3 mx-auto inline-flex w-auto">
            {t("contact.scheduleCall")}
            <ArrowRight className="w-5 h-5 text-[#002855]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
