"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Users, Car, Map, Target, Zap, Award, Heart, CheckCircle2, Sparkles, TrendingUp, Shield, Linkedin } from "lucide-react"
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
        // Use a shorter timeout for faster failure
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 1500)
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
        <TeamStatsSection />
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

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: t("aboutPage.projectManagement"),
      description: t("aboutPage.projectManagementDesc")
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("aboutPage.hrOutsourcing"),
      description: t("aboutPage.hrOutsourcingDesc")
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t("aboutPage.marketingSales"),
      description: t("aboutPage.marketingSalesDesc")
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t("aboutPage.customReporting"),
      description: t("aboutPage.customReportingDesc")
    }
  ]

  return (
    <section ref={sectionRef} className="luxury-section bg-white -mb-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #002855 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="luxury-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Text Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Award className="w-4 h-4 text-[#002855]" />
              <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">
                {t("aboutPage.whatWeDo")}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              {t("aboutPage.fullService")}
              <br />
              <span className="text-[#FFC72C]">{t("aboutPage.excellence")}</span>
            </h2>
            
            <p className="text-luxury-body text-[#003D7A] leading-relaxed mb-8">
              {t("aboutPage.fullServiceDesc")}
            </p>
            
            <div className="flex gap-4">
              <a href="#what-drives-us" className="luxury-button luxury-button-primary font-bold flex items-center gap-2">
                {t("aboutPage.learnMore")}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: Image Grid */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {mediaLoaded ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <img
                      src={mediaOverrides.introImage1 || "/new-images/coca-cola-image2.jpg"}
                    alt="Team collaboration"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <img
                      src={mediaOverrides.introImage2 || "/new-images/samsung-image1.jpg"}
                    alt="Marketing event"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <img
                      src={mediaOverrides.introImage3 || "/new-images/harman-image1.jpg"}
                    alt="Retail activation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent" />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <img
                      src={mediaOverrides.introImage4 || "/new-images/coca-cola-image3.jpg"}
                    alt="Experiential marketing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent" />
                </div>
              </div>
            </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
                  <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`glass-effect rounded-2xl p-8 luxury-border luxury-hover transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-[#002855] mb-3 uppercase">
                {feature.title}
              </h3>
              <p className="text-[#003D7A]">
                {feature.description}
              </p>
            </div>
          ))}
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
    <section id="what-drives-us" ref={sectionRef} className="py-32 relative overflow-hidden">
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

  const timeline = [
    {
      year: "1999",
      title: t("aboutPage.theBeginning"),
      description: t("aboutPage.theBeginningDesc"),
      image: "/new-images/coca-cola-image3.jpg",
      mediaKey: "timeline1"
    },
    {
      year: "2000-2017",
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

  return (
    <section ref={sectionRef} className="pt-32 pb-16 bg-white relative overflow-hidden">
      <div className="luxury-container relative z-10">
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

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#FFC72C] via-[#003D7A] to-[#002855] hidden lg:block" />

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="flex-1 w-full lg:w-auto">
                    <div className="glass-effect rounded-3xl p-8 md:p-12 luxury-border hover:shadow-2xl transition-all duration-500 group min-h-[240px] flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <span className="text-xl font-black text-[#002855] text-center leading-tight whitespace-pre-line">{item.year.replace('-', '\n')}</span>
                        </div>
                        <h3 className="text-xl md:text-3xl font-black text-[#002855] uppercase">{item.title}</h3>
                      </div>
                      <p className="text-luxury-body text-[#003D7A] leading-relaxed flex-grow">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="relative hidden lg:block">
                    <div className="w-6 h-6 rounded-full bg-[#FFC72C] border-4 border-white shadow-lg" />
                  </div>

                  {/* Image */}
                  <div className="flex-1 w-full lg:w-auto lg:min-w-0">
                    <div className="relative h-80 rounded-3xl overflow-hidden group w-full">
                      {mediaLoaded ? (
                      <img
                          src={mediaOverrides[item.mediaKey] || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      ) : (
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/80 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="text-4xl font-black text-white/20">{item.year}</div>
                      </div>
                    </div>
                  </div>
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

function TeamStatsSection() {
  const [activeTab, setActiveTab] = useState("office")
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const [officeTeam, setOfficeTeam] = useState<any[]>([])
  const [experienceConsultants, setExperienceConsultants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setOfficeTeam(data.officeTeam?.sort((a: any, b: any) => a.order - b.order) || [])
        setExperienceConsultants(data.experienceConsultants?.sort((a: any, b: any) => a.order - b.order) || [])
      } else {
        // Fallback to default data if API fails
        setOfficeTeam([
          { name: "Feissli Fritz", roleKey: "coCeoFinance", image: "/new-images/logo.png", funImage: "/new-images/logo.png", linkedin: "#" },
          { name: "Purpura Nicolas", roleKey: "coCeoIt", image: "/new-images/purpura-nicolas.jpg", funImage: "/new-images/purpura-nicolas-funny.jpg", linkedin: "#" },
          { name: "Albisser Carmela", roleKey: "finance", image: "/new-images/albisser-carmela.jpg", funImage: "/new-images/albisser-carmela-funny.jpg", linkedin: "#" },
          { name: "Kurz Martin", roleKey: "teamLeaderMerchandising", image: "/new-images/kurz-martin.jpg", funImage: "/new-images/kurz-martin-funny.jpg", linkedin: "#" },
          { name: "Teotino Angelo", roleKey: "headOfPromotion", image: "/new-images/teotino-angelo.jpg", funImage: "/new-images/teotino-angelo-funny.jpg", linkedin: "#" },
          { name: "Kevin Zanotta", roleKey: "seniorProjectManager", image: "/new-images/kevin-zanotta.jpg", funImage: "/new-images/kevin-zanotta-funny.jpg", linkedin: "#" },
          { name: "Jessica Makwala", roleKey: "projectManager", image: "/new-images/jessica-makwala.jpg", funImage: "/new-images/jessica-makwala-funny.jpg", linkedin: "#" },
          { name: "Benammar Samir", roleKey: "projectManager", image: "/new-images/benammar-samir.jpg", funImage: "/new-images/benammar-samir-funny.jpg", linkedin: "#" },
          { name: "Santos Cristina", roleKey: "juniorProjectManager", image: "/new-images/santos-cristina.jpg", funImage: "/new-images/santos-cristina-funny.jpg", linkedin: "#" },
          { name: "Müller Paula", roleKey: "backOffice", image: "/new-images/müller-paula.jpg", funImage: "/new-images/müller-paula-funny.jpg", linkedin: "#" },
          { name: "Berger Lukas", roleKey: "juniorProjectManager", image: "/new-images/lukas-berger.jpg", funImage: "/new-images/lukas-berger-funny.jpg", linkedin: "#" },
          { name: "Demelas Giuseppe", roleKey: "logisticsManager", image: "/new-images/demelas-giuseppe.jpg", funImage: "/new-images/demelas-giuseppe-funny.jpg", linkedin: "#" },
        ])
        setExperienceConsultants([
          "Anderson Al", "Baig Ayman", "Dario Iannelli", "Chafiha Messaouden",
          "Muneeb Sheikh", "Amir Uruqi", "Dannacher Lukas", "Indelicato Cristian",
          "King Stefan", "Losilla Alexis", "Maccia Giuseppe", "Manser Gibson",
          "Ylli Karakushi", "Kaan Özoguz", "Ghada Jouahri", "Hadj-Arab Samy",
          "Muanza Milton", "Singer Barbara", "Wuhrmann Kevin",
        ])
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
      // Use fallback data on error
      setOfficeTeam([
        { name: "Feissli Fritz", roleKey: "coCeoFinance", image: "/new-images/logo.png", funImage: "/new-images/logo.png", linkedin: "#" },
      ])
      setExperienceConsultants([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      icon: <Users className="w-12 h-12" />,
      number: "65",
      label: t("aboutPage.fieldForce"),
      description: t("aboutPage.fieldForceDesc")
    },
    {
      icon: <Map className="w-12 h-12" />,
      number: "151",
      label: t("aboutPage.circumnavigation"),
      description: t("aboutPage.circumnavigationDesc")
    },
    {
      icon: <Car className="w-12 h-12" />,
      number: "25",
      label: t("aboutPage.vehicleFleet"),
      description: t("aboutPage.vehicleFleetDesc")
    }
  ]

  const fieldForce = [
    { name: "Chao Victor", roleKey: "fieldForceManager" },
    { name: "Cioffi Elvis", roleKey: "fieldForceAreaManager" },
    { name: "Conese Cristian", roleKey: "fieldForceAreaManager" },
    { name: "Dia Abou", roleKey: "fieldForceManager" },
    { name: "Di Caro Antonio", roleKey: "fieldForceAreaManager" },
    { name: "Estevez Alberto", roleKey: "fieldForceManager" },
    { name: "Fleischmann Bryan", roleKey: "fieldForceManager" },
    { name: "Gerber Nathalie", roleKey: "fieldForceManager" },
    { name: "Khateeb Damir", roleKey: "fieldForceManager" },
    { name: "Kleber Dave", roleKey: "fieldForceManager" },
    { name: "Maglie Mattia", roleKey: "fieldForceManager" },
    { name: "Moeri Vincent", roleKey: "fieldForceManager" },
    { name: "Nikolic Stefan", roleKey: "fieldForceManager" },
    { name: "Scelza Leo", roleKey: "fieldForceManager" },
    { name: "Tedesco Michele", roleKey: "fieldForceManager" },
    { name: "Zala Claudio", roleKey: "fieldForceManager" },
    { name: "Jonuzi Jasin", roleKey: "fieldForceManager" },
    { name: "Matpan Fatih", roleKey: "fieldForceManager" },
    { name: "Tavares Claudino", roleKey: "experienceConsultant" },
    { name: "Tahery Shoeib", roleKey: "fieldForceManager" },
  ]

  const tabs = [
    { id: "office", labelKey: "officeTeam", count: officeTeam.length },
    { id: "field", labelKey: "fieldForceLabel", count: fieldForce.length },
    { id: "consultants", labelKey: "experienceConsultants", count: experienceConsultants.length },
  ]

  return (
    <section id="team-stats" ref={sectionRef} className="pt-16 pb-32 bg-white relative">
      <div className="luxury-container relative z-10">
        {/* Stats Section */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#002855]" />
              <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">
                {t("aboutPage.byTheNumbers")}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              {t("aboutPage.weHaveTeam")}
              <br />
              <span className="text-[#003D7A]">{t("aboutPage.teamsBack")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="relative glass-effect rounded-3xl p-10 text-center luxury-border h-full flex flex-col justify-between min-h-[340px] overflow-hidden hover:shadow-2xl hover:shadow-[#FFC72C]/20 transition-all duration-500 group-hover:-translate-y-2">
                  {/* Gold Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/0 to-[#FFC72C]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FFC72C]/10 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] flex items-center justify-center text-[#002855] shadow-lg shadow-[#FFC72C]/30 group-hover:scale-110 transition-transform duration-500">
                        {stat.icon}
                      </div>
                    </div>
                    
                    <div className="text-7xl font-black text-[#002855] mb-4 group-hover:text-[#FFC72C] transition-colors duration-500">
                      {stat.number}
                    </div>
                    
                    <h3 className="text-xl font-black text-[#002855] mb-4 uppercase tracking-wide">
                      {stat.label}
                    </h3>
                    
                    <p className="text-[#003D7A] text-base leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Users className="w-4 h-4 text-[#002855]" />
              <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">
                {t("aboutPage.meetTheTeam")}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              {t("aboutPage.talentedPeople")}
              <br />
              <span className="text-[#003D7A]">{t("aboutPage.drivingSuccess")}</span>
            </h2>
            
            <p className="text-luxury-body max-w-3xl mx-auto mb-12">
              {t("aboutPage.meetTeamDesc")}
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 w-full sm:w-auto sm:min-w-[200px] ${
                    activeTab === tab.id
                      ? "bg-[#FFC72C] text-[#002855] shadow-lg shadow-[#FFC72C]/30"
                      : "bg-white text-[#002855] hover:text-[#FFC72C] border border-gray-200 hover:border-[#FFC72C] hover:shadow-md"
                  }`}
                >
                  {t(`aboutPage.${tab.labelKey}`)}
                  <span className="ml-2 text-sm opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

        {/* Office Team */}
        {activeTab === "office" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
            {officeTeam.map((member, index) => (
              <div key={index} className="group" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
                {/* Simple Card Style for Small Screens (< 400px) */}
                <div className="office-team-simple glass-effect rounded-2xl p-6 text-center luxury-border luxury-hover">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl font-black text-white">
                      {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1]?.charAt(0) || ''}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#002855] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#003D7A]">{t(`aboutPage.${member.roleKey}`)}</p>
                </div>

                {/* Image Card Style for Screens >= 400px */}
                <div className="office-team-image relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[480px] w-full">
                  {/* Professional Image - Default State */}
                  <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855] via-[#002855]/50 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-sm md:text-base text-white/90 font-semibold">{t(`aboutPage.${member.roleKey}`)}</p>
                    </div>
                  </div>

                  {/* Fun Image - Hover State */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                    <img
                      src={member.funImage}
                      alt={`${member.name} - casual`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/90 via-[#002855]/40 to-transparent" />
                    
                    {/* Connect Section */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
                      >
                        <span className="text-lg md:text-xl font-bold text-[#002855]">
                          {t("aboutPage.letsConnect")}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Field Force */}
        {activeTab === "field" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {fieldForce.map((member, index) => (
              <div key={index} className="group">
                <div className="glass-effect rounded-2xl p-6 text-center luxury-border luxury-hover">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl font-black text-white">
                      {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1].charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#002855] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#003D7A]">{t(`aboutPage.${member.roleKey}`)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

          {/* Experience Consultants */}
          {activeTab === "consultants" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {experienceConsultants.map((member, index) => {
                // Handle both string (name) and object (TeamMember) formats
                const name = typeof member === 'string' ? member : member.name
                const roleKey = typeof member === 'object' ? member.roleKey : 'experienceConsultant'
                return (
                  <div key={typeof member === 'object' ? member.id : index} className="group">
                    <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-[#FFC72C] transition-all duration-500 hover:shadow-xl luxury-hover">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl font-black text-[#002855]">
                          {name.split(' ')[0].charAt(0)}{name.split(' ')[1]?.charAt(0) || ''}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#002855]">
                        {name}
                      </h3>
                      <p className="text-xs text-[#003D7A] mt-1">{t(`aboutPage.${roleKey}`)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
