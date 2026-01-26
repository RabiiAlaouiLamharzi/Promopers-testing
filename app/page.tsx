"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { HeroStatsSection } from "@/components/hero-stats-section"
import { FloatingFeaturesSection } from "@/components/floating-features-section"
import { ImageCarouselsSection } from "@/components/image-carousels-section"
import { AboutSection } from "@/components/about-section"
import { WorksSection } from "@/components/works-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <FloatingFeaturesSection />
        <ImageCarouselsSection />
        <AboutSection />
        <HeroStatsSection />
        <WorksSection />
        <TestimonialsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}
