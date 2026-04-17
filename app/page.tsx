"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { HeroStatsSection } from "@/components/hero-stats-section"
import { WorksSection } from "@/components/works-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navigation />
      <main>
        {/* Hero is fixed behind everything */}
        <HeroSection />
        {/* Spacer creates scroll room so hero is visible first */}
        <div style={{ height: "100vh" }} />
        {/* Content slides up over the fixed hero */}
        <div className="relative bg-white" style={{ zIndex: 10 }}>
          <ServicesSection />
          <WorksSection />
          <HeroStatsSection />
          <TestimonialsSection />
        </div>
      </main>
      <div className="relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>
    </div>
  )
}
