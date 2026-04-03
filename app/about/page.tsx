"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Target, Zap, Award, Heart, CheckCircle2, Sparkles, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
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
        <HeroSection />
        <IntroSection mediaOverrides={mediaOverrides} mediaLoaded={mediaLoaded} />
        <VisionCommitmentSection />
        <CompanyHistoryTimeline mediaOverrides={mediaOverrides} mediaLoaded={mediaLoaded} />
        <CTASection />
      </main>
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
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("aboutPage.aboutUs")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">PromoPers</span>
          </h1>
          
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
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
        <div className="mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Award className="w-4 h-4 text-[#002855]" />
              <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">{t("aboutPage.whatWeDo")}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[#002855]">
                {t("aboutPage.introHeading")}
                <br />
                {t("aboutPage.introHeadingSpan")}
              </h2>
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <p className="text-base md:text-lg text-[#003D7A] leading-relaxed mb-8">
                  {t("aboutPage.introDesc")}
                </p>
                <a
                  href="/about#vision"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FFC72C] text-[#002855] text-sm font-medium uppercase tracking-wider hover:bg-[#e6b526] transition-colors duration-300"
                >
                  {t("aboutPage.learnMore")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/40 to-transparent" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-44 group">
                    <img
                      src={mediaOverrides.introImage3 || "/new-images/samsung-image1.jpg"}
                      alt="Marketing"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/40 to-transparent" />
                  </div>
                </div>
                <div className="space-y-4 pt-10">
                  <div className="relative rounded-2xl overflow-hidden h-44 group">
                    <img
                      src={mediaOverrides.introImage2 || "/new-images/harman-image1.jpg"}
                      alt="Brand event"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/40 to-transparent" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-72 group">
                    <img
                      src={mediaOverrides.introImage4 || "/new-images/coca-cola-image3.jpg"}
                      alt="Campaign"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/40 to-transparent" />
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
                  className={`py-6 border-b border-[#002855]/40 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#002855] uppercase tracking-wide">
                      {s.label}
                    </span>
                    <span className="text-[#002855]/60">→</span>
                  </div>
                  <p className="text-sm font-light italic text-[#003D7A]/70 mt-2 leading-relaxed">
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

function VisionCommitmentSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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

  const coreValues = [
    {
      icon: <Target className="w-10 h-10" />,
      title: t("aboutPage.ourVision"),
      description: t("aboutPage.ourVisionDesc"),
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: t("aboutPage.ourMission"),
      description: t("aboutPage.ourMissionDesc"),
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: t("aboutPage.ourValues"),
      description: t("aboutPage.ourValuesDesc"),
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: t("aboutPage.ourApproach"),
      description: t("aboutPage.ourApproachDesc"),
    },
    {
      icon: <CheckCircle2 className="w-10 h-10" />,
      title: t("aboutPage.ourCommitment"),
      description: t("aboutPage.ourCommitmentDesc"),
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: t("aboutPage.ourHeritage"),
      description: t("aboutPage.ourHeritageDesc"),
    }
  ]

  return (
    <section id="vision" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002855] via-[#003D7A] to-[#002855]" />
      
      {/* Checkerboard Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, #FFC72C 25%, transparent 25%),
            linear-gradient(-45deg, #FFC72C 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #FFC72C 75%),
            linear-gradient(-45deg, transparent 75%, #FFC72C 75%)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0, 0 40px, 40px -40px, -40px 0px'
        }} />
      </div>

      {/* Gold Accent Blurs */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#FFC72C]/10 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[#FFC72C]/10 blur-3xl" />

      <div className="luxury-container relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect-dark mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-bold uppercase tracking-wider">
              {t("aboutPage.whatDrivesUs")}
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 uppercase leading-tight">
            {t("aboutPage.excellenceInEverything")}
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-8">
            {t("aboutPage.excellenceDesc")}
          </p>
          
          <p className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
            {t("aboutPage.excellenceDesc2")}
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="relative glass-effect-dark rounded-3xl p-8 h-full border border-white/10 hover:border-[#FFC72C] transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFC72C]/20 group-hover:-translate-y-2">
                {/* Gradient Glow on Hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFC72C]/0 via-[#FFC72C]/0 to-[#FFC72C]/0 group-hover:from-[#FFC72C]/5 group-hover:via-[#FFC72C]/0 group-hover:to-[#FFC72C]/5 transition-all duration-500" />
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] flex items-center justify-center text-[#002855] mb-6 shadow-lg shadow-[#FFC72C]/30 group-hover:scale-110 transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
                    {value.title}
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
    <section ref={sectionRef} className="pt-32 pb-16 bg-white relative">
      <div className="luxury-container relative z-10">

        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
            <Zap className="w-4 h-4 text-[#002855]" />
            <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">
              {t("aboutPage.ourJourney")}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
            {t("aboutPage.companyHistory")}
            <br />
            <span className="text-[#003D7A]">{t("aboutPage.companyHistorySubtitle")}</span>
          </h2>
          <p className="text-luxury-body max-w-3xl mx-auto">
            {t("aboutPage.companyHistoryDesc")}
          </p>
        </div>

        {/* Horizontal timeline bar */}
        <div
          className={`relative mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-gray-100" />
          <div
            className="absolute top-[18px] h-[2px] bg-gradient-to-r from-[#FFC72C] to-[#003D7A] transition-all duration-700"
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
                        ? "bg-[#FFC72C] border-[#FFC72C] shadow-[0_0_0_4px_rgba(255,199,44,0.15)] scale-110"
                        : passed
                          ? "bg-[#003D7A] border-[#003D7A]"
                          : "bg-white border-gray-200"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${inView || passed ? "bg-white" : "bg-gray-300"}`} />
                  </div>
                  <span className={`text-xs font-bold tracking-wide text-center leading-tight transition-colors duration-500 ${inView ? "text-[#002855]" : "text-gray-300"}`}>
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
          <div className="text-2xl md:text-3xl font-black text-[#002855] uppercase tracking-tight">
            {["1999", "2000", "2024"][index]}
            <span className="text-[#FFC72C] mx-3">→</span>
            {["2017", "2024", "2026"][index]}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("left")}
              disabled={index === 0}
              aria-label="Previous"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                index === 0
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "bg-[#002855] w-6" : "bg-gray-200 w-3"
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
                  : "border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/70 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className="text-5xl font-black text-white/20 leading-none">{item.year}</span>
                  </div>
                </div>
                <div className="bg-[#F8F9FC] rounded-b-3xl p-8 flex flex-col flex-1 border border-t-0 border-gray-100">
                  <h3 className="text-xl font-black text-[#002855] uppercase mb-3 leading-tight">{item.title}</h3>
                  <p className="text-sm text-[#003D7A] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Box */}
        <div
          className={`mt-24 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#002855] via-[#003D7A] to-[#002855]" />
            <div className="absolute inset-0 bg-[url('/new-images/promopers.jpg')] bg-cover bg-center opacity-10" />
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase">
                {t("aboutPage.joinSuccessStory")}
              </h3>
              <p className="text-luxury-large-light max-w-2xl mx-auto mb-8">
                {t("aboutPage.joinSuccessStoryDesc")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="https://promopers.staff.cloud/recruiting" target="_blank" rel="noopener noreferrer" className="luxury-button luxury-button-primary font-bold text-lg flex items-center gap-3">
                  {t("aboutPage.applyNow")}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="https://promopers.staff.cloud/recruiting" target="_blank" rel="noopener noreferrer" className="luxury-button bg-white/10 text-white font-bold text-lg border border-white/20">
                  {t("aboutPage.viewOpenPositions")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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
