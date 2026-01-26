"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"

export function SuccessFactorsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language, revision } = useLanguage()

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

  // Use useMemo to recalculate when language changes
  const successFactors = useMemo(() => [
    {
      title: t("successFactors.factor1.title"),
      subtitle: t("successFactors.factor1.subtitle"),
      description: t("successFactors.factor1.description"),
      image: "/new-images/In-House Development.png"
    },
    {
      title: t("successFactors.factor2.title"),
      subtitle: t("successFactors.factor2.subtitle"),
      description: t("successFactors.factor2.description"),
      image: "/new-images/Products & Sales Training.jpg"
    },
    {
      title: t("successFactors.factor3.title"),
      subtitle: t("successFactors.factor3.subtitle"),
      description: t("successFactors.factor3.description"),
      image: "/new-images/Big Data vs. Smart Data.png"
    },
    {
      title: t("successFactors.factor4.title"),
      subtitle: t("successFactors.factor4.subtitle"),
      description: t("successFactors.factor4.description"),
      image: "/new-images/Last Minute Logistics.jpg"
    },
    {
      title: t("successFactors.factor5.title"),
      subtitle: t("successFactors.factor5.subtitle"),
      description: t("successFactors.factor5.description"),
      image: "/new-images/Stationary Trade vs. E-commerce.webp"
    }
  ], [t, language, revision])

  return (
    <section ref={sectionRef} className="luxury-section bg-white">
      <div className="luxury-container">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#002855] rounded-full text-white text-sm font-medium mb-6 md:mb-8">
              <div className="w-2 h-2 rounded-full bg-[#FFC72C]" />
              {t("successFactors.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-black mb-4 md:mb-6 lg:mb-8 uppercase leading-tight">
              {t("successFactors.title")}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 px-4">
              {t("successFactors.description")}
            </p>
          </div>
        </div>

        <div className="space-y-12 md:space-y-16 lg:space-y-24">
          {successFactors.map((factor, index) => (
            <div
              key={index}
              className={`group luxury-hover transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              <div className="flex flex-col gap-8 lg:gap-16">
                {/* Content */}
                <div>
                  <div className="glass-effect rounded-3xl p-6 md:p-8 lg:p-12 luxury-border">
                    <div className="mb-6 md:mb-8">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002855] rounded-full text-white text-xs font-bold mb-4 md:mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFC72C]" />
                        FACTOR {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-black mb-4 md:mb-6 uppercase leading-tight">
                        {factor.title}
                      </h3>
                      <h4 className="text-lg md:text-xl font-bold text-[#002855] mb-6 md:mb-8">
                        {factor.subtitle}
                      </h4>
                    </div>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      {factor.description}
                    </p>
                    
                    {/* Decorative Line */}
                    <div className="mt-8 h-1 w-20 bg-[#FFC72C] rounded-full" />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <div className="relative rounded-3xl overflow-hidden premium-shadow">
                    <img
                      src={factor.image}
                      alt={factor.title}
                      className="w-full h-64 md:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    
                    {/* Image Badge */}
                    <div className="absolute top-6 right-6">
                      <div className="bg-[#FFC72C] text-black px-4 py-2 rounded-full text-sm font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
