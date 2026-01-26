"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface HeroData {
  videoUrl: string
  titleLine1: string
  titleLine2: string
  titleLine3: string
  description: string
  buttonText: string
  buttonLink: string
  overlayOpacity: number
  logos: string[]
  translations?: {
    [lang: string]: {
      [key: string]: string
    }
  }
}

export function HeroSection() {
  const { t, language, revision } = useLanguage()
  const [heroContent, setHeroContent] = useState<HeroData | null>(null)
  const [mediaOverrides, setMediaOverrides] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set loading to false immediately so page renders
    setLoading(false)
    // Load data in background
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      )

      // Step 1: Load media overrides FIRST with timeout
      const mediaPromise = fetch('/api/media').catch(err => {
        console.warn('[Hero] ⚠️ Failed to load media overrides:', err)
        return { ok: false, json: async () => ({}) }
      })
      
      let heroMedia = {}
      try {
        const mediaResponse = await Promise.race([mediaPromise, timeoutPromise]) as Response
        if (mediaResponse && mediaResponse.ok) {
        const data = await mediaResponse.json()
        heroMedia = data.hero || {}
        console.log('[Hero] 📦 Loaded media overrides:', heroMedia)
        setMediaOverrides(heroMedia)
      }
      } catch (err) {
        console.warn('[Hero] ⚠️ Media fetch failed or timed out:', err)
      }
      
      // Step 2: Load hero content and apply overrides immediately with timeout
      const homePromise = fetch('/api/home').catch(err => {
        console.warn('[Hero] ⚠️ Failed to load home data:', err)
        return { ok: false, json: async () => ({ hero: null }) }
      })
      
      try {
        const homeResponse = await Promise.race([homePromise, timeoutPromise]) as Response
        if (homeResponse && homeResponse.ok) {
        let heroData = (await homeResponse.json()).hero
        
        // Apply media overrides immediately
        if (Object.keys(heroMedia).length > 0) {
          if (heroMedia.videoUrl) {
            console.log('[Hero] 🎬 Applying video override:', heroMedia.videoUrl)
            heroData.videoUrl = heroMedia.videoUrl
          }
          
          if (heroData.logos) {
            heroData.logos = heroData.logos.map((logo: string, index: number) => 
              heroMedia[`logo${index}`] || logo
            )
          }
        }
        
        setHeroContent(heroData)
        console.log('[Hero] 🎬 Final video URL:', heroData.videoUrl)
        } else {
          // If API fails, use default data
          console.warn('[Hero] ⚠️ Using default hero data')
          setHeroContent(null)
        }
      } catch (err) {
        console.warn('[Hero] ⚠️ Home fetch failed or timed out:', err)
        setHeroContent(null)
      }
    } catch (error) {
      console.error('[Hero] ❌ Error loading data:', error)
      // Set to null to use defaults
      setHeroContent(null)
    } finally {
      // Always set loading to false, even if requests fail
      setLoading(false)
    }
  }

  // Use t() function directly - this includes overrides from JSONBin
  const titleLine1 = t("hero.titleLine1")
  const titleLine2 = t("hero.titleLine2")
  const titleLine3 = t("hero.titleLine3")
  const description = t("hero.description")
  const buttonText = t("hero.getStarted")

  // Get values from heroContent (which already has overrides applied)
  const videoUrl = heroContent?.videoUrl || "/video/promopers.mp4"
  const buttonLink = heroContent?.buttonLink || "#features"
  const overlayOpacity = heroContent?.overlayOpacity || 70
  
  // Logos already have overrides applied in loadData
  const logos = heroContent?.logos || [
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
    "/new-images/logo-n19.png"
  ]

  // Don't show loading screen - render immediately with defaults
  // The API calls will update the content when they complete

  return (
    <section id="home" className="relative w-full flex flex-col justify-between overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Full-Screen Video Background - Looping with no sound */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          key={videoUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Dark blue overlay for text readability */}
        <div className="absolute inset-0 bg-[#001833]" style={{ opacity: overlayOpacity / 100 }} />
      </div>

      {/* Content Overlay - Left Aligned */}
      <div className="relative z-10 flex-1 flex flex-col justify-center luxury-container">
        <div className="max-w-4xl pt-24 md:pt-32 ml-0">
          {/* Bigger Title with Custom Line Breaks - Translated */}
          <h1 className="text-white text-[clamp(1.75rem,5.5vw,4.25rem)] font-black leading-[0.95] mb-6 tracking-tight uppercase">
            {titleLine1}
            {titleLine2 && (
              <>
                <br />
                {titleLine2}
              </>
            )}
            {titleLine3 && (
              <>
                <br />
                {titleLine3}
              </>
            )}
          </h1>

          {/* PromoPers Description Subtitle - Italic with Reduced Line Height */}
          <p className="text-white/80 text-lg md:text-xl mb-6 max-w-2xl leading-tight italic">
            {description}
          </p>

          {/* Big Yellow Round Button - Smaller */}
          <a
            href={buttonLink}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#FFC72C] text-[#002855] font-semibold text-lg uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#E6B526]"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </a>
        </div>
      </div>

      {/* Logo Carousel - Transparent Background */}
      <div className="relative z-10 w-full py-12">
        <div className="w-full overflow-hidden">
      <div
            className="flex items-center animate-scroll"
            style={{ 
              width: '200%',
              animationDuration: '50s'
            }}
          >
            {/* Multiple sets for seamless infinite scroll */}
            {[...Array(4)].map((_, setIndex) =>
              logos.map((logo, index) => (
                <div
                  key={`logo-set${setIndex}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: `${100 / logos.length}%`, minWidth: '150px' }}
                >
                  <img
                    src={logo}
                    alt={`Brand Logo ${index + 1}`}
                    className="h-12 md:h-16 w-auto max-w-[150px] object-contain brightness-0 invert filter opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Hide logo if it fails to load (white square)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}