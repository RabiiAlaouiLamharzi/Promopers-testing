"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
export default function AboutPage() {
  const [mediaOverrides, setMediaOverrides] = useState<Record<string, string>>({})
  const [mediaLoaded, setMediaLoaded] = useState(false)

  // Load media overrides ONCE at page level for all sections
  // Start loading immediately when component mounts
  useEffect(() => {
    let cancelled = false
    
    const loadMediaOverrides = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
        
        // Fetch with cache control - browser will cache based on API response headers
        const responsePromise = fetch('/api/media', {
          headers: {
            'Cache-Control': 'max-age=60'
          }
        })
        
        const response = await Promise.race([responsePromise, timeoutPromise]) as Response
        
        if (!cancelled && response && response.ok) {
          const data = await response.json()
          const aboutPageMedia = data.aboutPage || {}
          console.log('[AboutPage] 📦 Loaded media overrides:', aboutPageMedia)
          setMediaOverrides(aboutPageMedia)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('[AboutPage] Error loading media overrides:', error)
          // Set loaded to true even on error so images show with defaults
        }
      } finally {
        if (!cancelled) {
          setMediaLoaded(true)
        }
      }
    }
    
    // Start loading immediately
    loadMediaOverrides()
    
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <IntroSection mediaOverrides={mediaOverrides} mediaLoaded={mediaLoaded} />
        <CompanyHistoryTimeline mediaOverrides={mediaOverrides} mediaLoaded={mediaLoaded} />
      </main>
      <Footer />
    </div>
  )
}


function IntroSection({ mediaOverrides, mediaLoaded }: { mediaOverrides: Record<string, string>, mediaLoaded: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const services = [
    { num: "01", label: t("aboutPage.introService1"), desc: t("aboutPage.introService1Desc") },
    { num: "02", label: t("aboutPage.introService2"), desc: t("aboutPage.introService2Desc") },
    { num: "03", label: t("aboutPage.introService3"), desc: t("aboutPage.introService3Desc") },
    { num: "04", label: t("aboutPage.introService4"), desc: t("aboutPage.introService4Desc") },
  ]

  return (
    <section ref={sectionRef} className="luxury-section bg-white">
      <div className="luxury-container">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
          <div className={`min-w-0 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
            <h2 className="text-headline text-[#121830] uppercase break-words">
              {t("aboutPage.introHeading")}
              <br />
              {t("aboutPage.introHeadingSpan")}
            </h2>
          </div>
          <div className={`min-w-0 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-base md:text-lg text-[#2B2F36] leading-relaxed">
              {t("aboutPage.introDesc")}
            </p>
          </div>
        </div>

        {/* Main content — images left, services right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left — staggered image grid */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            {mediaLoaded ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden h-72 group">
                    <img
                      src={mediaOverrides.introImage1 || "/new-images/coca-cola-image2.jpg"}
                      alt="Retail activation"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/40 to-transparent" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-44 group">
                    <img
                      src={mediaOverrides.introImage3 || "/new-images/samsung-image1.jpg"}
                      alt="Marketing"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/40 to-transparent" />
                  </div>
                </div>
                <div className="space-y-4 pt-10">
                  <div className="relative rounded-2xl overflow-hidden h-44 group">
                    <img
                      src={mediaOverrides.introImage2 || "/new-images/harman-image1.jpg"}
                      alt="Brand event"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/40 to-transparent" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-72 group">
                    <img
                      src={mediaOverrides.introImage4 || "/new-images/coca-cola-image3.jpg"}
                      alt="Campaign"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/40 to-transparent" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
                  <div className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
                </div>
                <div className="space-y-4 pt-10">
                  <div className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
                  <div className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Right — numbered services */}
          <div className="flex flex-col justify-center">
            {/* Service rows */}
            <div className="space-y-0">
              {services.map((s, i) => (
                <div
                  key={i}
                  className={`py-6 border-b border-[#121830]/40 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#121830] uppercase tracking-wide">
                      {s.label}
                    </span>
                    <span className="text-[#121830]/60">→</span>
                  </div>
                  <p className="text-sm font-light italic text-[#2B2F36]/70 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}


function CompanyHistoryTimeline({ mediaOverrides, mediaLoaded }: { mediaOverrides: Record<string, string>, mediaLoaded: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  const maxIndex = 2 // 4 cards − 2 visible = 2 possible steps
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!wrapperRef.current) return
    const gap = 24
    const measure = () => {
      if (wrapperRef.current) setCardWidth((wrapperRef.current.clientWidth - gap) / 2)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  const timeline = [
    {
      year: "1999",
      title: t("aboutPage.theBeginning"),
      description: t("aboutPage.theBeginningDesc"),
      image: "/new-images/coca-cola-image3.jpg",
      mediaKey: "timeline1"
    },
    {
      year: "2000–2017",
      title: t("aboutPage.growthExcellence"),
      description: t("aboutPage.growthExcellenceDesc"),
      image: "/new-images/coca-cola-image7.jpg",
      mediaKey: "timeline2"
    },
    {
      year: "2024",
      title: t("aboutPage.strategicMerger"),
      description: t("aboutPage.strategicMergerDesc"),
      image: "/new-images/random.jpg",
      mediaKey: "timeline3"
    },
    {
      year: "2026",
      title: t("aboutPage.industryLeaders"),
      description: t("aboutPage.industryLeadersDesc"),
      image: "/new-images/promopers.jpg",
      mediaKey: "timeline4"
    }
  ]

  const navigate = (dir: "left" | "right") => {
    const next = dir === "right" ? Math.min(index + 1, maxIndex) : Math.max(index - 1, 0)
    if (next === index) return
    setIndex(next)
    if (trackRef.current && cardWidth > 0) {
      trackRef.current.scrollTo({ left: next * (cardWidth + 24), behavior: "smooth" })
    }
  }

  return (
    <section ref={sectionRef} className="pt-32 bg-white relative">
      <div className="luxury-container relative z-10">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-20">
          <div className={`min-w-0 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
            <h2 className="text-headline text-[#121830] mb-4 uppercase break-words">{t("aboutPage.companyHistory")}</h2>
            <h3 className="text-subheadline text-[#2B2F36] uppercase break-words">{t("aboutPage.companyHistorySubtitle")}</h3>
          </div>
          <div className={`min-w-0 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-luxury-body text-[#2B2F36] leading-relaxed">
              {t("aboutPage.companyHistoryDesc")}
            </p>
          </div>
        </div>

        {/* Horizontal timeline bar */}
        <div
          className={`relative mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-gray-100" />
          <div
            className="absolute top-[18px] h-[2px] bg-gradient-to-r from-[#FFCE5C] to-[#2B2F36] transition-all duration-700"
            style={{ width: `${((index + 1) / (timeline.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between items-start">
            {timeline.map((item, i) => {
              const inView = i === index || i === index + 1
              const passed = i < index
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      inView
                        ? "bg-[#FFCE5C] border-[#FFCE5C] shadow-[0_0_0_4px_rgba(255,199,44,0.15)] scale-110"
                        : passed
                          ? "bg-[#2B2F36] border-[#2B2F36]"
                          : "bg-white border-gray-200"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${inView || passed ? "bg-white" : "bg-gray-300"}`} />
                  </div>
                  <span className={`text-xs font-bold tracking-wide text-center leading-tight transition-colors duration-500 ${inView ? "text-[#121830]" : "text-gray-300"}`}>
                    {item.year}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Nav row */}
        <div
          className={`flex items-center justify-between mb-8 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-2xl md:text-3xl font-black text-[#121830] uppercase tracking-tight">
            {["1999", "2000", "2024"][index]}
            <span className="text-[#FFCE5C] mx-3">→</span>
            {["2017", "2024", "2026"][index]}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("left")}
              disabled={index === 0}
              aria-label="Previous"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 text-xl font-light ${
                index === 0
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#121830] text-[#121830] hover:bg-[#121830] hover:text-white"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "bg-[#121830] w-6" : "bg-gray-200 w-3"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate("right")}
              disabled={index === maxIndex}
              aria-label="Next"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                index === maxIndex
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#121830] text-[#121830] hover:bg-[#121830] hover:text-white"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider — all 4 cards in one row, scrolls horizontally */}
        <style>{`.timeline-track::-webkit-scrollbar { display: none; }`}</style>
        <div ref={wrapperRef} className="overflow-hidden">
          <div
            ref={trackRef}
            className="timeline-track flex gap-6"
            style={{ overflowX: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {timeline.map((item, i) => (
              <div
                key={i}
                className="flex flex-col group flex-shrink-0"
                style={{ width: cardWidth > 0 ? `${cardWidth}px` : "calc(50% - 12px)" }}
              >
                <div className="relative h-72 rounded-t-3xl overflow-hidden">
                  {mediaLoaded ? (
                    <img
                      src={mediaOverrides[item.mediaKey] || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/70 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className="text-5xl font-black text-white/20 leading-none">{item.year}</span>
                  </div>
                </div>
                <div className="bg-[#F8F9FC] rounded-b-3xl p-8 flex flex-col flex-1 border border-t-0 border-gray-100">
                  <h3 className="text-xl font-black text-[#121830] uppercase mb-3 leading-tight">{item.title}</h3>
                  <p className="text-sm text-[#2B2F36] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

