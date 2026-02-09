"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useEdit } from "@/contexts/edit-context"
import { EditableText } from "@/components/editable-text"
import { CountUp } from "@/components/count-up"

export function HeroStatsSectionEditable() {
  const { t, language, revision } = useLanguage()
  const { editMode } = useEdit()
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const [stat1Label, setStat1Label] = useState(t("hero.branches"))
  const [stat1Desc, setStat1Desc] = useState(t("hero.branchesDesc"))
  const [stat2Label, setStat2Label] = useState(t("hero.salesPromotions"))
  const [stat2Desc, setStat2Desc] = useState(t("hero.salesPromotionsDesc"))
  const [stat3Label, setStat3Label] = useState(t("hero.satisfiedCustomers"))
  const [stat3Desc, setStat3Desc] = useState(t("hero.satisfiedCustomersDesc"))

  // Update translations when language changes
  useEffect(() => {
    setStat1Label(t("hero.branches"))
    setStat1Desc(t("hero.branchesDesc"))
    setStat2Label(t("hero.salesPromotions"))
    setStat2Desc(t("hero.salesPromotionsDesc"))
    setStat3Label(t("hero.satisfiedCustomers"))
    setStat3Desc(t("hero.satisfiedCustomersDesc"))
  }, [language, revision, t])

  const stats = [
    {
      number: 1978,
      label: stat1Label,
      description: stat1Desc,
      setLabel: setStat1Label,
      setDesc: setStat1Desc,
      translationKeyLabel: "hero.branches",
      translationKeyDesc: "hero.branchesDesc"
    },
    {
      number: 52360,
      label: stat2Label,
      description: stat2Desc,
      setLabel: setStat2Label,
      setDesc: setStat2Desc,
      translationKeyLabel: "hero.salesPromotions",
      translationKeyDesc: "hero.salesPromotionsDesc"
    },
    {
      number: 61,
      label: stat3Label,
      description: stat3Desc,
      setLabel: setStat3Label,
      setDesc: setStat3Desc,
      translationKeyLabel: "hero.satisfiedCustomers",
      translationKeyDesc: "hero.satisfiedCustomersDesc"
    },
  ]

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
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
    <section ref={sectionRef} className="w-full bg-[#002855] py-16 md:py-24">
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
              <EditableText
                value={stat.label}
                onChange={stat.setLabel}
                translationKey={stat.translationKeyLabel}
                as="div"
                className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-wide"
                editMode={editMode}
              />
              <EditableText
                value={stat.description}
                onChange={stat.setDesc}
                translationKey={stat.translationKeyDesc}
                as="div"
                className="text-base md:text-lg text-white/80"
                editMode={editMode}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

