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
          <div className="text-center text-[#121830]">Loading...</div>
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
            <h1 className="text-4xl font-bold text-[#121830] mb-4">{t("references.clientNotFound")}</h1>
            <Link href="/references" className="text-[#FFCE5C] hover:underline">
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
      <TitleSection data={clientData} t={t} />
      <ContentSection data={clientData} t={t} />
      <RelatedReferencesSection references={relatedReferences} t={t} />
      <Footer />
    </div>
  )
}


function TitleSection({ data, t }: { data: any, t: (key: string) => string }) {
  return (
    <section className="luxury-section bg-white">
      <div className="luxury-container">
        {/* Back link */}
        <Link href="/references" className="inline-flex items-center gap-2 text-sm text-[#2B2F36]/60 hover:text-[#121830] transition-colors mb-6 group">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          {t("references.backToReferences")}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {data.tags && data.tags.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121830] text-white text-xs font-bold rounded-full uppercase tracking-wide">
              <Tag className="w-3 h-3 text-[#FFCE5C]" />
              {data.tags[0]}
            </span>
          )}
          {data.location && (
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {data.location}
            </span>
          )}
          {data.date && (
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {data.date}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#121830] uppercase max-w-4xl leading-none tracking-tight">
          {data.name}
        </h1>
      </div>
    </section>
  )
}

function ContentSection({ data, t }: { data: any, t: (key: string) => string }) {
  return (
    <section className="pb-8 bg-white">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">

          {/* Main Content */}
          <div className="space-y-10">
            {/* Hero Image */}
            {data.heroImage && (
              <div className="w-full">
                <img
                  src={data.heroImage}
                  alt={data.name}
                  className="w-full h-auto rounded-3xl shadow-xl"
                />
              </div>
            )}

            {/* Gallery Images */}
            {data.images && data.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.images.map((imageUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${data.name} - Image ${index + 1}`}
                    className="w-full h-auto rounded-3xl shadow-xl"
                  />
                ))}
              </div>
            )}

            {/* Rich text content */}
            {data.additionalText && typeof data.additionalText === 'string' && data.additionalText.trim() ? (
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-base text-[#2B2F36] leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: data.additionalText }}
                />
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="sticky top-24 space-y-8">
            <h3 className="text-sm font-bold text-[#121830] uppercase tracking-widest">{t("references.projectDetails")}</h3>

            <div className="space-y-6">
              {(data.client || data.name) && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t("references.client")}</p>
                  <p className="text-sm font-medium text-[#121830]">{data.client || data.name}</p>
                </div>
              )}
              {data.location && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t("references.location")}</p>
                  <p className="text-sm font-medium text-[#121830]">{data.location}</p>
                </div>
              )}
              {data.date && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t("references.date")}</p>
                  <p className="text-sm font-medium text-[#121830]">{data.date}</p>
                </div>
              )}
              {data.tags && data.tags.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{t("references.tags")}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag: string, index: number) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121830] text-white rounded-full text-xs font-medium">
                        <Tag className="w-3 h-3 text-[#FFCE5C]" />
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
    </section>
  )
}

function RelatedReferencesSection({ references, t }: { references: any[], t: (key: string) => string }) {
  if (references.length === 0) return null

  return (
    <section className="pt-12 pb-8 bg-white">
      <div className="luxury-container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <h2 className="text-headline text-[#121830] uppercase">Related</h2>
            <h3 className="text-headline text-[#2B2F36] uppercase">References</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {references.map((ref) => (
            <Link key={ref.slug} href={`/references/${ref.slug}`}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={ref.image}
                    alt={ref.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/70 via-[#121830]/20 to-transparent" />
                </div>
                <div className="p-7 flex-grow flex flex-col">
                  <h3 className="text-base font-bold text-[#121830] mb-2 leading-tight">{ref.name}</h3>
                  {ref.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">{ref.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {ref.date && <span className="text-xs text-gray-400">{ref.date}</span>}
                    <div className="inline-flex items-center gap-1.5 text-[#121830] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                      {t("references.readMore")}
                      <ArrowRight className="w-4 h-4" />
                    </div>
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

