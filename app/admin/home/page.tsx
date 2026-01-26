"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { HeroSectionEditable } from "@/components/hero-section-editable"
import { FloatingFeaturesSection } from "@/components/floating-features-section"
import { FloatingFeaturesSectionEditable } from "@/components/floating-features-section-editable"
import { ImageCarouselsSection } from "@/components/image-carousels-section"
import { ImageCarouselsSectionEditable } from "@/components/image-carousels-section-editable"
import { AboutSection } from "@/components/about-section"
import { AboutSectionEditable } from "@/components/about-section-editable"
import { HeroStatsSection } from "@/components/hero-stats-section"
import { HeroStatsSectionEditable } from "@/components/hero-stats-section-editable"
import { WorksSection } from "@/components/works-section"
import { WorksSectionEditable } from "@/components/works-section-editable"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TestimonialsSectionEditable } from "@/components/testimonials-section-editable"
import { ContactCTA } from "@/components/contact-cta"
import { ContactCTAEditable } from "@/components/contact-cta-editable"
import { Save, Edit2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EditProvider, useEdit } from "@/contexts/edit-context"
import { TextOverridesProvider, useTextOverrides } from "@/contexts/text-overrides-context"
import { useLanguage } from "@/contexts/language-context"

type Language = 'en' | 'fr' | 'de' | 'it'

function AdminHomeContent() {
  const { toast } = useToast()
  const { currentLanguage, setCurrentLanguage, setEditMode } = useEdit()
  const { saveOverrides, isSaving } = useTextOverrides()
  const { reloadOverrides } = useLanguage()
  
  // Always enable edit mode in admin
  useEffect(() => {
    setEditMode(true)
  }, [])

  const handleSave = async () => {
    try {
      console.log('[AdminHome] Saving changes...')
      await saveOverrides()
      console.log('[AdminHome] Saved to JSONBin, now reloading in LanguageContext...')
      // Reload overrides in LanguageContext to reflect changes immediately
      await reloadOverrides()
      console.log('[AdminHome] ✅ All changes saved and reloaded!')
      toast({
        title: "Saved!",
        description: "Changes saved successfully to database",
      })
    } catch (error) {
      console.error('[AdminHome] ❌ Save failed:', error)
      toast({
        title: "Error!",
        description: "Failed to save changes",
        variant: "destructive",
      })
    }
  }

  // Buttons work normally - no edit icons needed
  useEffect(() => {
    // No modifications needed
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Allow all buttons and links to work normally */
        .admin-edit-mode a,
        .admin-edit-mode button {
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        /* Make editable text and icons work properly */
        .admin-edit-mode .editable-text {
          cursor: default !important;
          position: relative;
          z-index: 1;
        }
        
        /* Allow image uploads */
        .admin-edit-mode .editable-image-upload {
          cursor: pointer !important;
          pointer-events: auto !important;
        }
        
        /* Ensure save button works */
        .admin-edit-mode .admin-save-button {
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        /* UNIVERSAL EDIT ICON STYLING - Apply to ALL edit icons in the website */
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

      {/* Scrollable Content - EXACT COPY OF HOMEPAGE with editing capabilities */}
      <main>
        <HeroSectionEditable />
        <FloatingFeaturesSectionEditable />
        <ImageCarouselsSectionEditable />
        <AboutSectionEditable />
        <HeroStatsSectionEditable />
        <WorksSectionEditable />
        <TestimonialsSectionEditable />
        <ContactCTAEditable />
      </main>

      <Footer />
      </div>
    </>
  )
}

export default function AdminHomePage() {
  return (
    <TextOverridesProvider>
    <EditProvider>
      <AdminHomeContent />
    </EditProvider>
    </TextOverridesProvider>
  )
}
