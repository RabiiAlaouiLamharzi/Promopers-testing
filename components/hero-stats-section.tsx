"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { CountUp } from "@/components/count-up"

export function HeroStatsSection() {
  const { t } = useLanguage()
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    {
      number: 1978,
      label: t("hero.branches"),
      description: t("hero.branchesDesc"),
    },
    {
      number: 52360,
      label: t("hero.salesPromotions"),
      description: t("hero.salesPromotionsDesc"),
    },
    {
      number: 61,
      label: t("hero.satisfiedCustomers"),
      description: t("hero.satisfiedCustomersDesc"),
    },
  ]

  useEffect(() => {
    if (hasAnimated) return // Don't observe if already animated

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          // Disconnect observer after first trigger
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <section ref={sectionRef} className="w-full bg-[#121830] py-16 md:py-24 mt-32">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4">
                {hasAnimated ? (
                  <CountUp end={stat.number} duration={1500} />
                ) : (
                  stat.number.toLocaleString()
                )}
              </div>
              <div className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-base md:text-lg text-white/80">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
