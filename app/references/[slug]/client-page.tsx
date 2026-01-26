"use client"

import { useEffect, useState, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, MapPin, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedReference } from "@/lib/reference-translations"
import type { Reference } from "@/lib/references"

// Generate related references
function getRelatedReferences(currentSlug: string, allReferences: any[], t: (key: string) => string) {
  const related = allReferences
    .filter(ref => ref.slug !== currentSlug && ref.published)
    .slice(0, 3)
    .map(ref => {
      // Extract text from rich text editor content (additionalText)
      let description = ''
      if (ref.additionalText && typeof ref.additionalText === 'string') {
        // Strip HTML tags and get plain text (server-safe method)
        description = ref.additionalText
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
          .replace(/&amp;/g, '&') // Replace &amp; with &
          .replace(/&lt;/g, '<') // Replace &lt; with <
          .replace(/&gt;/g, '>') // Replace &gt; with >
          .replace(/&quot;/g, '"') // Replace &quot; with "
          .trim()
      }
      
      // Fallback to tagline if no content
      if (!description && ref.tagline) {
        description = ref.tagline
      }
      
      return {
        slug: ref.slug,
        name: ref.name,
        image: ref.heroImage || ref.image,
        description: description.length > 200 ? description.substring(0, 200) + '...' : description
      }
    })
  
  return related
}

export default function ClientDetailPage() {
  const { t, language } = useLanguage()
  const params = useParams()
  const slug = params?.slug as string | undefined
  const [clientData, setClientData] = useState<any>(null)
  const [originalData, setOriginalData] = useState<Reference | null>(null)
  const [relatedReferences, setRelatedReferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchReference()
    }
  }, [slug])

  const fetchReference = async () => {
    try {
      const response = await fetch(`/api/references?slug=${slug}`)
      if (!response.ok) {
        setLoading(false)
        return
      }
      const data: Reference = await response.json()
      
      // Store original data for language switching
      setOriginalData(data)
      
      // Apply translations
      const translated = getTranslatedReference(data, language)
      setClientData(translated)
      
      // Fetch all references for related section
      const allRefsResponse = await fetch('/api/references')
      const allRefs: Reference[] = await allRefsResponse.json()
      const translatedRefs = allRefs.map(ref => getTranslatedReference(ref, language))
      setRelatedReferences(getRelatedReferences(slug!, translatedRefs, t))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching reference:', error)
      setLoading(false)
    }
  }

  // Update translations when language changes
  useEffect(() => {
    if (originalData) {
      const translated = getTranslatedReference(originalData, language)
      setClientData(translated)
      
      // Also update related references
      if (slug) {
        fetch('/api/references')
          .then(res => res.json())
          .then((allRefs: Reference[]) => {
            const translatedRefs = allRefs.map(ref => getTranslatedReference(ref, language))
            setRelatedReferences(getRelatedReferences(slug, translatedRefs, t))
          })
          .catch(console.error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, originalData, slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-[#002855]">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#002855] mb-4">{t("references.clientNotFound")}</h1>
            <Link href="/references" className="text-[#FFC72C] hover:underline">
              {t("references.backToReferences")}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection data={clientData} t={t} />
      <ContentSection data={clientData} t={t} />
      <RelatedReferencesSection references={relatedReferences} t={t} />
      <CTASection t={t} />
      <Footer />
    </div>
  )
}

function HeroSection({ data, t }: { data: any, t: (key: string) => string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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
            <span className="text-[#FFC72C]">{data.name}</span>
          </h1>
          
          {data.tagline && (
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              {data.tagline}
            </p>
          )}
          
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
  )
}

function ContentSection({ data, t }: { data: any, t: (key: string) => string }) {
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

  return (
    <section ref={sectionRef} className="py-20 bg-white relative">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Left Side (2 columns) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero Image */}
            {data.heroImage && (
              <div className="w-full">
                <img
                  src={data.heroImage}
                  alt={data.name}
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
              </div>
            )}

            {/* Gallery Images */}
            {data.images && data.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.images.map((imageUrl: string, index: number) => (
                  <div key={index} className="w-full">
                    <img
                      src={imageUrl}
                      alt={`${data.name} - Image ${index + 1}`}
                      className="w-full h-auto rounded-2xl shadow-xl"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Content from Rich Text Editor - Only show HTML content */}
            {data.additionalText && typeof data.additionalText === 'string' && data.additionalText.trim() ? (
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-lg text-[#003D7A] leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: data.additionalText }}
                />
              </div>
            ) : null}


          </div>

          {/* Project Details Sidebar - Right Side (1 column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-[#002855] mb-8">{t("references.projectDetails")}</h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#FFC72C]/20 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-[#002855]" />
                    </div>
                    <span className="text-sm font-bold text-[#002855] uppercase tracking-wide">{t("references.client")}</span>
                  </div>
                  <p className="text-[#003D7A] ml-11">{data.client || data.name}</p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#FFC72C]/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#002855]" />
                    </div>
                    <span className="text-sm font-bold text-[#002855] uppercase tracking-wide">{t("references.location")}</span>
                  </div>
                  <p className="text-[#003D7A] ml-11">{data.location || 'N/A'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#FFC72C]/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#002855]" />
                    </div>
                    <span className="text-sm font-bold text-[#002855] uppercase tracking-wide">{t("references.date")}</span>
                  </div>
                  <p className="text-[#003D7A] ml-11">{data.date || 'N/A'}</p>
                </div>

                {data.tags && data.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#FFC72C]/20 rounded-lg flex items-center justify-center">
                        <Tag className="w-4 h-4 text-[#002855]" />
                      </div>
                      <span className="text-sm font-bold text-[#002855] uppercase tracking-wide">{t("references.tags")}</span>
                    </div>
                    <div className="ml-11 flex flex-wrap gap-2">
                      {data.tags.map((tag: string, index: number) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002855] text-white rounded-full text-sm font-medium">
                          <Tag className="w-3.5 h-3.5 text-[#FFC72C]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedReferencesSection({ references, t }: { references: any[], t: (key: string) => string }) {
  if (references.length === 0) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="luxury-container">
        <h2 className="text-4xl md:text-5xl font-black text-[#002855] mb-4 uppercase text-center">
          {t("references.relatedReferences") || "Related References"}
        </h2>
        <div className="w-20 h-0.5 bg-[#FFC72C] mx-auto mb-12" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {references.map((ref) => (
            <Link key={ref.slug} href={`/references/${ref.slug}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ref.image}
                    alt={ref.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#002855] mb-3">{ref.name}</h3>
                  <p className="text-[#003D7A] leading-relaxed mb-6 flex-grow">{ref.description}</p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFC72C] text-[#002855] font-bold hover:bg-[#E6B526] hover:gap-4 transition-all duration-300 shadow-lg shadow-[#FFC72C]/30">
                    {t("references.readMore")}
                    <ArrowRight className="w-5 h-5 text-[#002855]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ t }: { t: (key: string) => string }) {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="text-center">
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
