"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowRight, Video as VideoIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useEdit } from "@/contexts/edit-context"
import { EditableText } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"

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

export function HeroSectionEditable() {
  const { t, language, revision } = useLanguage()
  const { editMode } = useEdit()
  const [heroContent, setHeroContent] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState<number | null>(null)
  const [mediaOverridesLoaded, setMediaOverridesLoaded] = useState<Record<string, string>>({})

  // Editable state
  const [titleLine1, setTitleLine1] = useState(t("hero.titleLine1"))
  const [titleLine2, setTitleLine2] = useState(t("hero.titleLine2"))
  const [titleLine3, setTitleLine3] = useState(t("hero.titleLine3"))
  const [description, setDescription] = useState(t("hero.description"))
  const [buttonText, setButtonText] = useState(t("hero.getStarted"))

  // Load media overrides once on mount, THEN load hero content
  useEffect(() => {
    console.log('[HeroEditable] 🔄 Component mounted, loading data...')
    const loadData = async () => {
      try {
        // Step 1: Load media overrides FIRST
        const mediaResponse = await fetch('/api/media')
        let heroMedia = {}
        
        if (mediaResponse.ok) {
          const data = await mediaResponse.json()
          heroMedia = data.hero || {}
          console.log('[HeroEditable] 📦 Loaded media overrides:', heroMedia)
          setMediaOverridesLoaded(heroMedia)
        }
        
        // Step 2: Load hero content and apply overrides immediately
        const homeResponse = await fetch('/api/home')
        
        if (homeResponse.ok) {
          let heroData = (await homeResponse.json()).hero
          console.log('[HeroEditable] 📊 Original hero data:', heroData)
          
          // Apply media overrides immediately
          if (Object.keys(heroMedia).length > 0) {
            if (heroMedia.videoUrl) {
              console.log('[HeroEditable] 🎬 Applying video override:', heroMedia.videoUrl)
              heroData.videoUrl = heroMedia.videoUrl
            }
            
            if (heroData.logos) {
              heroData.logos = heroData.logos.map((logo: string, index: number) => 
                heroMedia[`logo${index}`] || logo
              )
            }
            
            console.log('[HeroEditable] ✅ Applied media overrides')
          }
          
          setHeroContent(heroData)
          console.log('[HeroEditable] 🎬 Final video URL:', heroData.videoUrl)
      }
    } catch (error) {
        console.error('[HeroEditable] ❌ Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
    
    loadData()
  }, [])

  // Update translations when language changes
  useEffect(() => {
    setTitleLine1(t("hero.titleLine1"))
    setTitleLine2(t("hero.titleLine2"))
    setTitleLine3(t("hero.titleLine3"))
    setDescription(t("hero.description"))
    setButtonText(t("hero.getStarted"))
  }, [t, language, revision])

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !heroContent) return

    setUploadingVideo(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'video')

      const response = await fetch('/api/home/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[HeroEditable] Video uploaded successfully:', data.url)
        
        setHeroContent({
          ...heroContent,
          videoUrl: data.url
        })
        
        // Update media overrides state to persist across re-renders
        setMediaOverridesLoaded(prev => ({
          ...prev,
          videoUrl: data.url
        }))
        
        // Save to JSONBin
        const saveResponse = await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'hero',
            key: 'videoUrl',
            value: data.url
          })
        })
        
        if (saveResponse.ok) {
          console.log('[HeroEditable] ✅ Saved hero video to JSONBin')
        } else {
          console.error('[HeroEditable] ❌ Failed to save video to JSONBin')
        }
      }
    } catch (error) {
      console.error('[HeroEditable] Error uploading video:', error)
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleLogoUpload = async (index: number, newSrc: string) => {
    if (!heroContent) return
    const newLogos = [...(heroContent.logos || [])]
    newLogos[index] = newSrc
    setHeroContent({
      ...heroContent,
      logos: newLogos
    })
    
    // Update media overrides state to persist across re-renders
    setMediaOverridesLoaded(prev => ({
      ...prev,
      [`logo${index}`]: newSrc
    }))
    
    // Save to JSONBin
    const response = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'hero',
        key: `logo${index}`,
        value: newSrc
      })
    })
    
    if (response.ok) {
      console.log(`[HeroEditable] ✅ Saved hero logo ${index} to JSONBin`)
    } else {
      console.error(`[HeroEditable] ❌ Failed to save logo ${index} to JSONBin`)
    }
  }

  const videoUrl = heroContent?.videoUrl || "/video/promopers.mp4"
  const buttonLink = heroContent?.buttonLink || "#features"
  const overlayOpacity = heroContent?.overlayOpacity || 70
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

  if (loading) {
    return (
      <section id="home" className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="text-white">Loading...</div>
      </section>
    )
  }

  return (
    <section id="home" className="relative w-full flex flex-col justify-between overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Full-Screen Video Background - Looping with no sound */}
      <div className="absolute inset-0 z-0 group">
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
        
        {/* Video Upload Button */}
        {editMode && (
          <button
            onClick={() => videoInputRef.current?.click()}
            disabled={uploadingVideo}
            className="absolute top-24 right-4 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 z-10"
          >
            {uploadingVideo ? (
              <div className="w-6 h-6 border-4 border-[#FFC72C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <VideoIcon className="w-6 h-6 text-[#002855]" />
            )}
          </button>
        )}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleVideoUpload}
          className="hidden"
        />
      </div>

      {/* Content Overlay - Left Aligned */}
      <div className="relative z-10 flex-1 flex flex-col justify-center luxury-container">
        <div className="max-w-4xl pt-24 md:pt-32 ml-0">
          {/* Bigger Title with Custom Line Breaks - Translated */}
          <h1 className="text-white text-[clamp(1.75rem,5.5vw,4.25rem)] font-black leading-[0.95] mb-6 tracking-tight uppercase">
            <EditableText
              value={titleLine1}
              onChange={setTitleLine1}
              translationKey="hero.titleLine1"
              editMode={editMode}
              dark={true}
              className="text-white"
            />
            {(titleLine2 || editMode) && (
              <>
                {titleLine2 && <br />}
                <EditableText
                  value={titleLine2}
                  onChange={setTitleLine2}
                  translationKey="hero.titleLine2"
                  editMode={editMode}
                  dark={true}
                  className="text-white"
                />
              </>
            )}
            {(titleLine3 || editMode) && (
              <>
                {titleLine3 && <br />}
                <EditableText
                  value={titleLine3}
                  onChange={setTitleLine3}
                  translationKey="hero.titleLine3"
                  editMode={editMode}
                  dark={true}
                  className="text-white"
                />
              </>
            )}
          </h1>

          {/* PromoPers Description Subtitle - Italic with Reduced Line Height */}
          <EditableText
            value={description}
            onChange={setDescription}
            translationKey="hero.description"
            as="p"
            multiline
            editMode={editMode}
            dark={true}
            className="text-white/80 text-lg md:text-xl mb-6 max-w-2xl leading-tight italic"
          />

          {/* Big Yellow Round Button - Smaller */}
          <a
            href={buttonLink}
            onClick={(e) => {
              if (editMode) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#FFC72C] text-[#002855] font-semibold text-lg uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#E6B526]"
          >
            <EditableText
              value={buttonText}
              onChange={setButtonText}
              translationKey="hero.getStarted"
              editMode={editMode}
              className="font-semibold"
            />
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
              logos.map((logo, index) => {
                const originalIndex = index % logos.length
                return (
                  <div
                    key={`logo-set${setIndex}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: `${100 / logos.length}%`, minWidth: '150px' }}
                  >
                    {editMode ? (
                      <div className="relative h-12 md:h-16 w-[150px] flex items-center justify-center">
                        <EditableImage
                          src={logo}
                          alt={`Brand Logo ${originalIndex + 1}`}
                          className="h-full w-auto max-w-full object-contain brightness-0 invert filter opacity-80"
                          editMode={editMode}
                          onImageChange={(newSrc) => handleLogoUpload(originalIndex, newSrc)}
                          section="hero"
                          mediaKey={`logo${originalIndex}`}
                        />
                      </div>
                    ) : (
                      <img
                        src={logo}
                        alt={`Brand Logo ${index + 1}`}
                        className="h-12 md:h-16 w-auto max-w-[150px] object-contain brightness-0 invert filter opacity-80 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

