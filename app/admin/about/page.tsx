"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Users, Car, Map, Target, Zap, Award, Heart, CheckCircle2, Sparkles, TrendingUp, Shield, Save } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getRoleDisplayLabel } from "@/lib/team-role-display"
import { useToast } from "@/hooks/use-toast"
import { EditProvider, useEdit } from "@/contexts/edit-context"
import { TextOverridesProvider, useTextOverrides } from "@/contexts/text-overrides-context"
import { EditableText } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"

type Language = 'en' | 'fr' | 'de' | 'it'

function AdminAboutContent() {
  const { toast } = useToast()
  const { currentLanguage, setCurrentLanguage, setEditMode } = useEdit()
  const { saveOverrides, isSaving } = useTextOverrides()
  const { reloadOverrides, t } = useLanguage()
  const [mediaOverridesLoaded, setMediaOverridesLoaded] = useState<Record<string, string>>({})
  
  // Always enable edit mode in admin
  useEffect(() => {
    setEditMode(true)
  }, [setEditMode])

  // Load media overrides for about page
  useEffect(() => {
    const loadMediaOverrides = async () => {
      try {
        const response = await fetch('/api/media')
        if (response.ok) {
          const data = await response.json()
          const aboutPageMedia = data.aboutPage || {}
          console.log('[AdminAbout] 📦 Loaded media overrides:', aboutPageMedia)
          setMediaOverridesLoaded(aboutPageMedia)
        }
      } catch (error) {
        console.error('[AdminAbout] Error loading media overrides:', error)
      }
    }
    
    loadMediaOverrides()
  }, [])

  const handleSave = async () => {
    try {
      console.log('[AdminAbout] Saving changes...')
      await saveOverrides()
      console.log('[AdminAbout] Saved to JSONBin, now reloading in LanguageContext...')
      await reloadOverrides()
      console.log('[AdminAbout] ✅ All changes saved and reloaded!')
      toast({
        title: "Saved!",
        description: "Changes saved successfully to database",
      })
    } catch (error) {
      console.error('[AdminAbout] ❌ Save failed:', error)
      toast({
        title: "Error!",
        description: "Failed to save changes",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .admin-edit-mode a,
        .admin-edit-mode button {
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        .admin-edit-mode .editable-text {
          cursor: default !important;
          position: relative;
          z-index: 1;
        }
        
        .admin-edit-mode .editable-image-upload {
          cursor: pointer !important;
          pointer-events: auto !important;
        }
        
        .admin-edit-mode .admin-save-button {
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        .edit-icon {
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          pointer-events: auto !important;
          color: #666 !important;
          transition: color 0.2s ease !important;
          opacity: 1 !important;
          visibility: visible !important;
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .edit-icon:hover {
          color: #002855 !important;
        }
        
        .edit-icon svg {
          width: 20px !important;
          height: 20px !important;
          stroke: currentColor !important;
          fill: none !important;
        }
      `}} />
      <div className="min-h-screen bg-white admin-edit-mode">
        <Navigation />
      
        {/* Floating Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="admin-save-button fixed bottom-8 right-8 px-8 py-4 bg-[#FFC72C] text-[#002855] rounded-full font-bold hover:bg-[#E6B526] transition-all shadow-2xl flex items-center gap-3 z-50 hover:scale-105 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Scrollable Content - About Page with editing capabilities */}
        <main>
          <HeroSection />
          <IntroSection mediaOverrides={mediaOverridesLoaded} onImageChange={(key, url) => {
            setMediaOverridesLoaded(prev => ({ ...prev, [key]: url }))
          }} />
          <VisionCommitmentSection />
          <CompanyHistoryTimeline mediaOverrides={mediaOverridesLoaded} onImageChange={(key, url) => {
            setMediaOverridesLoaded(prev => ({ ...prev, [key]: url }))
          }} />
          <TeamStatsSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  )
}

// Simple wrapper components that use EditableText
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [aboutUs, setAboutUs] = useState(t("aboutPage.aboutUs"))

  useEffect(() => {
    setIsVisible(true)
    setAboutUs(t("aboutPage.aboutUs"))
  }, [t])

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
            <EditableText
              value={aboutUs}
              onChange={setAboutUs}
              translationKey="aboutPage.aboutUs"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]"
            />
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

function IntroSection({ mediaOverrides, onImageChange }: { mediaOverrides: Record<string, string>, onImageChange: (key: string, url: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [whatWeDo, setWhatWeDo] = useState(t("aboutPage.whatWeDo"))
  const [fullService, setFullService] = useState(t("aboutPage.fullService"))
  const [excellence, setExcellence] = useState(t("aboutPage.excellence"))
  const [fullServiceDesc, setFullServiceDesc] = useState(t("aboutPage.fullServiceDesc"))
  const [learnMore, setLearnMore] = useState(t("aboutPage.learnMore"))

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

  useEffect(() => {
    setWhatWeDo(t("aboutPage.whatWeDo"))
    setFullService(t("aboutPage.fullService"))
    setExcellence(t("aboutPage.excellence"))
    setFullServiceDesc(t("aboutPage.fullServiceDesc"))
    setLearnMore(t("aboutPage.learnMore"))
  }, [t])

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      titleKey: "aboutPage.projectManagement",
      descriptionKey: "aboutPage.projectManagementDesc"
    },
    {
      icon: <Users className="w-8 h-8" />,
      titleKey: "aboutPage.hrOutsourcing",
      descriptionKey: "aboutPage.hrOutsourcingDesc"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      titleKey: "aboutPage.marketingSales",
      descriptionKey: "aboutPage.marketingSalesDesc"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      titleKey: "aboutPage.customReporting",
      descriptionKey: "aboutPage.customReportingDesc"
    }
  ]

  return (
    <section ref={sectionRef} className="luxury-section bg-white -mb-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #002855 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="luxury-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Award className="w-4 h-4 text-[#002855]" />
              <EditableText
                value={whatWeDo}
                onChange={setWhatWeDo}
                translationKey="aboutPage.whatWeDo"
                editMode={editMode}
                as="span"
                className="text-[#002855] text-sm font-bold uppercase tracking-wider"
              />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              <EditableText
                value={fullService}
                onChange={setFullService}
                translationKey="aboutPage.fullService"
                editMode={editMode}
                as="span"
                className=""
              />
              <br />
              <EditableText
                value={excellence}
                onChange={setExcellence}
                translationKey="aboutPage.excellence"
                editMode={editMode}
                as="span"
                className="text-[#FFC72C]"
              />
            </h2>
            
            <p className="text-luxury-body text-[#003D7A] leading-relaxed mb-8">
              <EditableText
                value={fullServiceDesc}
                onChange={setFullServiceDesc}
                translationKey="aboutPage.fullServiceDesc"
                editMode={editMode}
                as="span"
                multiline
              />
            </p>
            
            <div className="flex gap-4">
              <a href="#what-drives-us" className="luxury-button luxury-button-primary font-bold flex items-center gap-2">
                <EditableText
                  value={learnMore}
                  onChange={setLearnMore}
                  translationKey="aboutPage.learnMore"
                  editMode={editMode}
                  as="span"
                />
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <EditableImage
                    src={mediaOverrides.introImage1 || "/new-images/coca-cola-image2.jpg"}
                    alt="Team collaboration"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    editMode={editMode}
                    onImageChange={(url) => onImageChange('introImage1', url)}
                    section="aboutPage"
                    mediaKey="introImage1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent pointer-events-none" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <EditableImage
                    src={mediaOverrides.introImage2 || "/new-images/samsung-image1.jpg"}
                    alt="Marketing event"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    editMode={editMode}
                    onImageChange={(url) => onImageChange('introImage2', url)}
                    section="aboutPage"
                    mediaKey="introImage2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent pointer-events-none" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <EditableImage
                    src={mediaOverrides.introImage3 || "/new-images/harman-image1.jpg"}
                    alt="Retail activation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    editMode={editMode}
                    onImageChange={(url) => onImageChange('introImage3', url)}
                    section="aboutPage"
                    mediaKey="introImage3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent pointer-events-none" />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <EditableImage
                    src={mediaOverrides.introImage4 || "/new-images/coca-cola-image3.jpg"}
                    alt="Experiential marketing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    editMode={editMode}
                    onImageChange={(url) => onImageChange('introImage4', url)}
                    section="aboutPage"
                    mediaKey="introImage4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={isVisible}
              editMode={editMode}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index, isVisible, editMode }: { feature: any, index: number, isVisible: boolean, editMode: boolean }) {
  const { t } = useLanguage()
  const [title, setTitle] = useState(t(feature.titleKey))
  const [description, setDescription] = useState(t(feature.descriptionKey))
  
  useEffect(() => {
    setTitle(t(feature.titleKey))
    setDescription(t(feature.descriptionKey))
  }, [t, feature.titleKey, feature.descriptionKey])

  return (
    <div
      className={`glass-effect rounded-2xl p-8 luxury-border luxury-hover transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${(index + 4) * 100}ms` }}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] flex items-center justify-center text-white mb-6">
        {feature.icon}
      </div>
      <h3 className="text-xl font-black text-[#002855] mb-3 uppercase">
        <EditableText
          value={title}
          onChange={setTitle}
          translationKey={feature.titleKey}
          editMode={editMode}
          as="span"
        />
      </h3>
      <p className="text-[#003D7A]">
        <EditableText
          value={description}
          onChange={setDescription}
          translationKey={feature.descriptionKey}
          editMode={editMode}
          as="span"
          multiline
        />
      </p>
    </div>
  )
}

function VisionCommitmentSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [whatDrivesUs, setWhatDrivesUs] = useState(t("aboutPage.whatDrivesUs"))
  const [excellenceInEverything, setExcellenceInEverything] = useState(t("aboutPage.excellenceInEverything"))
  const [excellenceDesc, setExcellenceDesc] = useState(t("aboutPage.excellenceDesc"))
  const [excellenceDesc2, setExcellenceDesc2] = useState(t("aboutPage.excellenceDesc2"))

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

  useEffect(() => {
    setWhatDrivesUs(t("aboutPage.whatDrivesUs"))
    setExcellenceInEverything(t("aboutPage.excellenceInEverything"))
    setExcellenceDesc(t("aboutPage.excellenceDesc"))
    setExcellenceDesc2(t("aboutPage.excellenceDesc2"))
  }, [t])

  const coreValues = [
    {
      icon: <Target className="w-10 h-10" />,
      titleKey: "aboutPage.ourVision",
      descriptionKey: "aboutPage.ourVisionDesc",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      titleKey: "aboutPage.ourMission",
      descriptionKey: "aboutPage.ourMissionDesc",
    },
    {
      icon: <Award className="w-10 h-10" />,
      titleKey: "aboutPage.ourValues",
      descriptionKey: "aboutPage.ourValuesDesc",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      titleKey: "aboutPage.ourApproach",
      descriptionKey: "aboutPage.ourApproachDesc",
    },
    {
      icon: <CheckCircle2 className="w-10 h-10" />,
      titleKey: "aboutPage.ourCommitment",
      descriptionKey: "aboutPage.ourCommitmentDesc",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      titleKey: "aboutPage.ourHeritage",
      descriptionKey: "aboutPage.ourHeritageDesc",
    }
  ]

  return (
    <section id="what-drives-us" ref={sectionRef} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#002855] via-[#003D7A] to-[#002855]" />
      
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
            <EditableText
              value={whatDrivesUs}
              onChange={setWhatDrivesUs}
              translationKey="aboutPage.whatDrivesUs"
              editMode={editMode}
              as="span"
              className="text-white/90 text-sm font-bold uppercase tracking-wider"
              dark
            />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 uppercase leading-tight">
            <EditableText
              value={excellenceInEverything}
              onChange={setExcellenceInEverything}
              translationKey="aboutPage.excellenceInEverything"
              editMode={editMode}
              as="span"
              className=""
              dark
            />
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-8">
            <EditableText
              value={excellenceDesc}
              onChange={setExcellenceDesc}
              translationKey="aboutPage.excellenceDesc"
              editMode={editMode}
              as="span"
              multiline
              dark
            />
          </p>
          
          <p className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
            <EditableText
              value={excellenceDesc2}
              onChange={setExcellenceDesc2}
              translationKey="aboutPage.excellenceDesc2"
              editMode={editMode}
              as="span"
              multiline
              dark
            />
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coreValues.map((value, index) => (
            <CoreValueCard
              key={index}
              value={value}
              index={index}
              isVisible={isVisible}
              editMode={editMode}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CoreValueCard({ value, index, isVisible, editMode }: { value: any, index: number, isVisible: boolean, editMode: boolean }) {
  const { t } = useLanguage()
  const [title, setTitle] = useState(t(value.titleKey))
  const [description, setDescription] = useState(t(value.descriptionKey))
  
  useEffect(() => {
    setTitle(t(value.titleKey))
    setDescription(t(value.descriptionKey))
  }, [t, value.titleKey, value.descriptionKey])

  return (
    <div
      className={`group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${(index + 2) * 100}ms` }}
    >
      <div className="relative glass-effect-dark rounded-3xl p-8 h-full border border-white/10 hover:border-[#FFC72C] transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFC72C]/20 group-hover:-translate-y-2">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFC72C]/0 via-[#FFC72C]/0 to-[#FFC72C]/0 group-hover:from-[#FFC72C]/5 group-hover:via-[#FFC72C]/0 group-hover:to-[#FFC72C]/5 transition-all duration-500" />
        
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] flex items-center justify-center text-[#002855] mb-6 shadow-lg shadow-[#FFC72C]/30 group-hover:scale-110 transition-transform duration-500">
            {value.icon}
          </div>
          <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
            <EditableText
              value={title}
              onChange={setTitle}
              translationKey={value.titleKey}
              editMode={editMode}
              as="span"
              dark
            />
          </h3>
          <p className="text-white/80 text-base leading-relaxed">
            <EditableText
              value={description}
              onChange={setDescription}
              translationKey={value.descriptionKey}
              editMode={editMode}
              as="span"
              multiline
              dark
            />
          </p>
        </div>
      </div>
    </div>
  )
}

function CompanyHistoryTimeline({ mediaOverrides, onImageChange }: { mediaOverrides: Record<string, string>, onImageChange: (key: string, url: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [ourJourney, setOurJourney] = useState(t("aboutPage.ourJourney"))
  const [companyHistory, setCompanyHistory] = useState(t("aboutPage.companyHistory"))
  const [companyHistorySubtitle, setCompanyHistorySubtitle] = useState(t("aboutPage.companyHistorySubtitle"))
  const [companyHistoryDesc, setCompanyHistoryDesc] = useState(t("aboutPage.companyHistoryDesc"))
  const [joinSuccessStory, setJoinSuccessStory] = useState(t("aboutPage.joinSuccessStory"))
  const [joinSuccessStoryDesc, setJoinSuccessStoryDesc] = useState(t("aboutPage.joinSuccessStoryDesc"))
  const [applyNow, setApplyNow] = useState(t("aboutPage.applyNow"))
  const [viewOpenPositions, setViewOpenPositions] = useState(t("aboutPage.viewOpenPositions"))

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

  useEffect(() => {
    setOurJourney(t("aboutPage.ourJourney"))
    setCompanyHistory(t("aboutPage.companyHistory"))
    setCompanyHistorySubtitle(t("aboutPage.companyHistorySubtitle"))
    setCompanyHistoryDesc(t("aboutPage.companyHistoryDesc"))
    setJoinSuccessStory(t("aboutPage.joinSuccessStory"))
    setJoinSuccessStoryDesc(t("aboutPage.joinSuccessStoryDesc"))
    setApplyNow(t("aboutPage.applyNow"))
    setViewOpenPositions(t("aboutPage.viewOpenPositions"))
  }, [t])

  const timeline = [
    {
      year: "1999",
      titleKey: "aboutPage.theBeginning",
      descriptionKey: "aboutPage.theBeginningDesc",
      image: "/new-images/coca-cola-image3.jpg",
      mediaKey: "timeline1"
    },
    {
      year: "2000-2017",
      titleKey: "aboutPage.growthExcellence",
      descriptionKey: "aboutPage.growthExcellenceDesc",
      image: "/new-images/coca-cola-image7.jpg",
      mediaKey: "timeline2"
    },
    {
      year: "2018",
      titleKey: "aboutPage.strategicMerger",
      descriptionKey: "aboutPage.strategicMergerDesc",
      image: "/new-images/random.jpg",
      mediaKey: "timeline3"
    },
    {
      year: "2025",
      titleKey: "aboutPage.industryLeaders",
      descriptionKey: "aboutPage.industryLeadersDesc",
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
            <EditableText
              value={ourJourney}
              onChange={setOurJourney}
              translationKey="aboutPage.ourJourney"
              editMode={editMode}
              as="span"
              className="text-[#002855] text-sm font-bold uppercase tracking-wider"
            />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
            <EditableText
              value={companyHistory}
              onChange={setCompanyHistory}
              translationKey="aboutPage.companyHistory"
              editMode={editMode}
              as="span"
            />
            <br />
            <EditableText
              value={companyHistorySubtitle}
              onChange={setCompanyHistorySubtitle}
              translationKey="aboutPage.companyHistorySubtitle"
              editMode={editMode}
              as="span"
              className="text-[#003D7A]"
            />
          </h2>
          
          <p className="text-luxury-body max-w-3xl mx-auto">
            <EditableText
              value={companyHistoryDesc}
              onChange={setCompanyHistoryDesc}
              translationKey="aboutPage.companyHistoryDesc"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#FFC72C] via-[#003D7A] to-[#002855] hidden lg:block" />

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isVisible={isVisible}
                editMode={editMode}
                mediaOverrides={mediaOverrides}
                onImageChange={onImageChange}
              />
            ))}
          </div>
        </div>

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
                <EditableText
                  value={joinSuccessStory}
                  onChange={setJoinSuccessStory}
                  translationKey="aboutPage.joinSuccessStory"
                  editMode={editMode}
                  as="span"
                  dark
                />
              </h3>
              <p className="text-luxury-large-light max-w-2xl mx-auto mb-8">
                <EditableText
                  value={joinSuccessStoryDesc}
                  onChange={setJoinSuccessStoryDesc}
                  translationKey="aboutPage.joinSuccessStoryDesc"
                  editMode={editMode}
                  as="span"
                  multiline
                  dark
                />
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="https://promopers.staff.cloud/recruiting" target="_blank" rel="noopener noreferrer" className="luxury-button luxury-button-primary font-bold text-lg flex items-center gap-3">
                  <EditableText
                    value={applyNow}
                    onChange={setApplyNow}
                    translationKey="aboutPage.applyNow"
                    editMode={editMode}
                    as="span"
                  />
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="https://promopers.staff.cloud/recruiting" target="_blank" rel="noopener noreferrer" className="luxury-button bg-white/10 text-white font-bold text-lg border border-white/20">
                  <EditableText
                    value={viewOpenPositions}
                    onChange={setViewOpenPositions}
                    translationKey="aboutPage.viewOpenPositions"
                    editMode={editMode}
                    as="span"
                    dark
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item, index, isVisible, editMode, mediaOverrides, onImageChange }: { item: any, index: number, isVisible: boolean, editMode: boolean, mediaOverrides: Record<string, string>, onImageChange: (key: string, url: string) => void }) {
  const { t } = useLanguage()
  const [title, setTitle] = useState(t(item.titleKey))
  const [description, setDescription] = useState(t(item.descriptionKey))
  
  useEffect(() => {
    setTitle(t(item.titleKey))
    setDescription(t(item.descriptionKey))
  }, [t, item.titleKey, item.descriptionKey])

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        <div className="flex-1 w-full lg:w-auto">
          <div className="glass-effect rounded-3xl p-8 md:p-12 luxury-border hover:shadow-2xl transition-all duration-500 group min-h-[240px] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <span className="text-xl font-black text-[#002855] text-center leading-tight whitespace-pre-line">{item.year.replace('-', '\n')}</span>
              </div>
              <h3 className="text-xl md:text-3xl font-black text-[#002855] uppercase">
                <EditableText
                  value={title}
                  onChange={setTitle}
                  translationKey={item.titleKey}
                  editMode={editMode}
                  as="span"
                />
              </h3>
            </div>
            <p className="text-luxury-body text-[#003D7A] leading-relaxed flex-grow">
              <EditableText
                value={description}
                onChange={setDescription}
                translationKey={item.descriptionKey}
                editMode={editMode}
                as="span"
                multiline
              />
            </p>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="w-6 h-6 rounded-full bg-[#FFC72C] border-4 border-white shadow-lg" />
        </div>

        <div className="flex-1 w-full lg:w-auto lg:min-w-0">
          <div className="relative h-80 rounded-3xl overflow-hidden group w-full">
            <EditableImage
              src={mediaOverrides[item.mediaKey] || item.image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              editMode={editMode}
              onImageChange={(url) => onImageChange(item.mediaKey, url)}
              section="aboutPage"
              mediaKey={item.mediaKey}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
              <div className="text-4xl font-black text-white/20">{item.year}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamStatsSection() {
  const [activeTab, setActiveTab] = useState("office")
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()
  const { editMode } = useEdit()
  const [byTheNumbers, setByTheNumbers] = useState(t("aboutPage.byTheNumbers"))
  const [weHaveTeam, setWeHaveTeam] = useState(t("aboutPage.weHaveTeam"))
  const [teamsBack, setTeamsBack] = useState(t("aboutPage.teamsBack"))
  const [meetTheTeam, setMeetTheTeam] = useState(t("aboutPage.meetTheTeam"))
  const [talentedPeople, setTalentedPeople] = useState(t("aboutPage.talentedPeople"))
  const [drivingSuccess, setDrivingSuccess] = useState(t("aboutPage.drivingSuccess"))
  const [meetTeamDesc, setMeetTeamDesc] = useState(t("aboutPage.meetTeamDesc"))
  const [officeTeam, setOfficeTeam] = useState<any[]>([])
  const [experienceConsultants, setExperienceConsultants] = useState<any[]>([])
  const [fieldForce, setFieldForce] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setByTheNumbers(t("aboutPage.byTheNumbers"))
    setWeHaveTeam(t("aboutPage.weHaveTeam"))
    setTeamsBack(t("aboutPage.teamsBack"))
    setMeetTheTeam(t("aboutPage.meetTheTeam"))
    setTalentedPeople(t("aboutPage.talentedPeople"))
    setDrivingSuccess(t("aboutPage.drivingSuccess"))
    setMeetTeamDesc(t("aboutPage.meetTeamDesc"))
    fetchTeamData()
  }, [t])

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setOfficeTeam(data.officeTeam?.sort((a: any, b: any) => a.order - b.order) || [])
        setExperienceConsultants(data.experienceConsultants?.sort((a: any, b: any) => a.order - b.order) || [])
        setFieldForce(data.fieldForce?.sort((a: any, b: any) => a.order - b.order) || [])
      } else {
        // Fallback to default data if API fails
        setOfficeTeam([
          { name: "Feissli Fritz", roleKey: "coCeoFinance", image: "/new-images/logo.png", funImage: "/new-images/logo.png", linkedin: "#" },
        ])
        setExperienceConsultants([])
        setFieldForce([])
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
      setOfficeTeam([
        { name: "Feissli Fritz", roleKey: "coCeoFinance", image: "/new-images/logo.png", funImage: "/new-images/logo.png", linkedin: "#", xing: "#" },
      ])
      setExperienceConsultants([])
      setFieldForce([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      icon: <Users className="w-12 h-12" />,
      number: "65",
      labelKey: "aboutPage.fieldForce",
      descriptionKey: "aboutPage.fieldForceDesc"
    },
    {
      icon: <Map className="w-12 h-12" />,
      number: "151",
      labelKey: "aboutPage.circumnavigation",
      descriptionKey: "aboutPage.circumnavigationDesc"
    },
    {
      icon: <Car className="w-12 h-12" />,
      number: "25",
      labelKey: "aboutPage.vehicleFleet",
      descriptionKey: "aboutPage.vehicleFleetDesc"
    }
  ]

  const tabs = [
    { id: "office", labelKey: "officeTeam", count: officeTeam.length },
    { id: "field", labelKey: "fieldForceLabel", count: fieldForce.length },
    { id: "consultants", labelKey: "experienceConsultants", count: experienceConsultants.length },
  ]

  return (
    <section id="team-stats" ref={sectionRef} className="pt-16 pb-32 bg-white relative">
      <div className="luxury-container relative z-10">
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#002855]" />
              <EditableText
                value={byTheNumbers}
                onChange={setByTheNumbers}
                translationKey="aboutPage.byTheNumbers"
                editMode={editMode}
                as="span"
                className="text-[#002855] text-sm font-bold uppercase tracking-wider"
              />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              <EditableText
                value={weHaveTeam}
                onChange={setWeHaveTeam}
                translationKey="aboutPage.weHaveTeam"
                editMode={editMode}
                as="span"
              />
              <br />
              <EditableText
                value={teamsBack}
                onChange={setTeamsBack}
                translationKey="aboutPage.teamsBack"
                editMode={editMode}
                as="span"
                className="text-[#003D7A]"
              />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                stat={stat}
                editMode={editMode}
              />
            ))}
          </div>
        </div>

        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Users className="w-4 h-4 text-[#002855]" />
              <EditableText
                value={meetTheTeam}
                onChange={setMeetTheTeam}
                translationKey="aboutPage.meetTheTeam"
                editMode={editMode}
                as="span"
                className="text-[#002855] text-sm font-bold uppercase tracking-wider"
              />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              <EditableText
                value={talentedPeople}
                onChange={setTalentedPeople}
                translationKey="aboutPage.talentedPeople"
                editMode={editMode}
                as="span"
              />
              <br />
              <EditableText
                value={drivingSuccess}
                onChange={setDrivingSuccess}
                translationKey="aboutPage.drivingSuccess"
                editMode={editMode}
                as="span"
                className="text-[#003D7A]"
              />
            </h2>
            
            <p className="text-luxury-body max-w-3xl mx-auto mb-12">
              <EditableText
                value={meetTeamDesc}
                onChange={setMeetTeamDesc}
                translationKey="aboutPage.meetTeamDesc"
                editMode={editMode}
                as="span"
                multiline
              />
            </p>

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

          {activeTab === "office" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
              {officeTeam.map((member, index) => (
                <div key={index} className="group" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
                  <div className="office-team-simple glass-effect rounded-2xl p-6 text-center luxury-border luxury-hover">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-black text-white">
                        {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1]?.charAt(0) || ''}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#002855] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#003D7A]">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                  </div>

                  <div className="office-team-image relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[480px] w-full">
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
                        <p className="text-sm md:text-base text-white/90 font-semibold">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                      </div>
                    </div>

                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                      <img
                        src={member.funImage}
                        alt={`${member.name} - casual`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/90 via-[#002855]/40 to-transparent" />
                      
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

          {activeTab === "field" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {fieldForce.map((member, index) => (
                <div key={member.id ?? index} className="group">
                  <div className="glass-effect rounded-2xl p-6 text-center luxury-border luxury-hover">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-black text-white">
                        {member.name?.split(' ')[0]?.charAt(0) ?? ''}{member.name?.split(' ')[1]?.charAt(0) ?? ''}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#002855] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#003D7A]">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                      <p className="text-xs text-[#003D7A] mt-1">{getRoleDisplayLabel(roleKey, t, language)}</p>
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

function StatCard({ stat, editMode }: { stat: any, editMode: boolean }) {
  const { t } = useLanguage()
  const [label, setLabel] = useState(t(stat.labelKey))
  const [description, setDescription] = useState(t(stat.descriptionKey))
  
  useEffect(() => {
    setLabel(t(stat.labelKey))
    setDescription(t(stat.descriptionKey))
  }, [t, stat.labelKey, stat.descriptionKey])

  return (
    <div className="group">
      <div className="relative glass-effect rounded-3xl p-10 text-center luxury-border h-full flex flex-col justify-between min-h-[340px] overflow-hidden hover:shadow-2xl hover:shadow-[#FFC72C]/20 transition-all duration-500 group-hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/0 to-[#FFC72C]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FFC72C]/10 transition-all duration-500" />
        
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
            <EditableText
              value={label}
              onChange={setLabel}
              translationKey={stat.labelKey}
              editMode={editMode}
              as="span"
            />
          </h3>
          
          <p className="text-[#003D7A] text-base leading-relaxed">
            <EditableText
              value={description}
              onChange={setDescription}
              translationKey={stat.descriptionKey}
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
        </div>
      </div>
    </div>
  )
}

function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [readyToWork, setReadyToWork] = useState(t("contact.readyToWork"))
  const [discussBrand, setDiscussBrand] = useState(t("contact.discussBrand"))
  const [scheduleCall, setScheduleCall] = useState(t("contact.scheduleCall"))

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

  useEffect(() => {
    setReadyToWork(t("contact.readyToWork"))
    setDiscussBrand(t("contact.discussBrand"))
    setScheduleCall(t("contact.scheduleCall"))
  }, [t])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className={`text-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } transition-all duration-1500`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            <EditableText
              value={readyToWork}
              onChange={setReadyToWork}
              translationKey="contact.readyToWork"
              editMode={editMode}
              as="span"
            />
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            <EditableText
              value={discussBrand}
              onChange={setDiscussBrand}
              translationKey="contact.discussBrand"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>

          <Link href="/contact" className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors flex items-center gap-3 mx-auto inline-flex w-auto">
            <EditableText
              value={scheduleCall}
              onChange={setScheduleCall}
              translationKey="contact.scheduleCall"
              editMode={editMode}
              as="span"
            />
            <ArrowRight className="w-5 h-5 text-[#002855]" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function AdminAboutPage() {
  return (
    <TextOverridesProvider>
      <EditProvider>
        <AdminAboutContent />
      </EditProvider>
    </TextOverridesProvider>
  )
}

