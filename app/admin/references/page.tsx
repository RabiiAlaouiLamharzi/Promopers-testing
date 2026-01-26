"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Save } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { EditProvider, useEdit } from "@/contexts/edit-context"
import { TextOverridesProvider, useTextOverrides } from "@/contexts/text-overrides-context"
import { EditableText } from "@/components/editable-text"

function AdminReferencesContent() {
  const { toast } = useToast()
  const { setEditMode } = useEdit()
  const { saveOverrides, isSaving } = useTextOverrides()
  const { reloadOverrides, t } = useLanguage()
  
  // Always enable edit mode in admin
  useEffect(() => {
    setEditMode(true)
  }, [setEditMode])

  const handleSave = async () => {
    try {
      console.log('[AdminReferences] Saving changes...')
      await saveOverrides()
      await reloadOverrides()
      console.log('[AdminReferences] ✅ All changes saved and reloaded!')
      toast({
        title: "Saved!",
        description: "Changes saved successfully to database",
      })
    } catch (error) {
      console.error('[AdminReferences] ❌ Save failed:', error)
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

        <main>
          <HeroSection />
          <IntroSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [ourWork, setOurWork] = useState(t("references.ourWork"))
  const [references, setReferences] = useState(t("references.references"))

  useEffect(() => {
    setIsVisible(true)
    setOurWork(t("references.ourWork"))
    setReferences(t("references.references"))
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
              value={ourWork}
              onChange={setOurWork}
              translationKey="references.ourWork"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]"
                  />
                </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <EditableText
              value={references}
              onChange={setReferences}
              translationKey="references.references"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C]"
            />
          </h1>
          
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
                </div>
              </div>
    </section>
  )
}

function IntroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [ourWorkWith, setOurWorkWith] = useState(t("references.ourWorkWith"))
  const [leadingBrands, setLeadingBrands] = useState(t("references.leadingBrands"))
  const [longTermPartnerships, setLongTermPartnerships] = useState(t("references.longTermPartnerships"))

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
    setOurWorkWith(t("references.ourWorkWith"))
    setLeadingBrands(t("references.leadingBrands"))
    setLongTermPartnerships(t("references.longTermPartnerships"))
  }, [t])

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
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
            <EditableText
              value={ourWorkWith}
              onChange={setOurWorkWith}
              translationKey="references.ourWorkWith"
              editMode={editMode}
              as="span"
            />
            <br />
            <EditableText
              value={leadingBrands}
              onChange={setLeadingBrands}
              translationKey="references.leadingBrands"
              editMode={editMode}
              as="span"
              className="font-black text-[#FFC72C]"
            />
          </h2>
          
          <div className="w-20 h-px bg-[#FFC72C] mx-auto mb-8" />
          
          <p className="text-lg md:text-xl text-[#003D7A]/80 font-light max-w-2xl mx-auto leading-relaxed">
            <EditableText
              value={longTermPartnerships}
              onChange={setLongTermPartnerships}
              translationKey="references.longTermPartnerships"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
              </div>
                </div>
    </section>
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

export default function AdminReferencesPage() {
  return (
    <TextOverridesProvider>
      <EditProvider>
        <AdminReferencesContent />
      </EditProvider>
    </TextOverridesProvider>
  )
}
