"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { ArrowRight, Zap, Users, BarChart3, Check } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language, revision, mediaOverrides } = useLanguage()

  const [features, setFeatures] = useState([
    {
      image: "/new-images/In-House Development.png",
      number: "01",
      title: t("about.inHouseDevelopment"),
      description: t("about.inHouseDevelopmentDesc"),
      benefits: [t("about.customSoftwareSolutions"), t("about.customerDrivenDevelopment")]
    },
    {
      image: "/new-images/Products & Sales Training.jpg",
      number: "02",
      title: t("about.productsSalesTraining"),
      description: t("about.productsSalesTrainingDesc"),
      benefits: [t("about.optimalSalesConsultations"), t("about.strategicIncentiveSystems")]
    },
    {
      image: "/new-images/Big Data vs. Smart Data.png",
      number: "03",
      title: t("about.bigData"),
      description: t("about.bigDataDesc"),
      benefits: [t("about.dailyDataUpdates"), t("about.realTimeInsights")]
    },
    {
      image: "/new-images/Optimal route planning.jpg",
      number: "04",
      title: t("about.routePlanning"),
      description: t("about.routePlanningDesc"),
      benefits: [t("about.strategicStoreVisits"), t("about.multiLanguageExpertise")]
    },
    {
      image: "/new-images/Last Minute Logistics.jpg",
      number: "05",
      title: t("about.lastMinuteLogistics"),
      description: t("about.lastMinuteLogisticsDesc"),
      benefits: [t("about.warehouse500m2"), t("about.onlineOrderingSolution")]
    },
    {
      image: "/new-images/Stationary Trade vs. E-commerce.webp",
      number: "06",
      title: t("about.stationaryTrade"),
      description: t("about.stationaryTradeDesc"),
      benefits: [t("about.multichannelSolutions"), t("about.retailExpertise")]
    }
  ])

  // Update features when language or media overrides change
  useEffect(() => {
    const baseFeatures = [
    {
      image: "/new-images/In-House Development.png",
      number: "01",
      title: t("about.inHouseDevelopment"),
      description: t("about.inHouseDevelopmentDesc"),
      benefits: [t("about.customSoftwareSolutions"), t("about.customerDrivenDevelopment")]
    },
    {
      image: "/new-images/Products & Sales Training.jpg",
      number: "02",
      title: t("about.productsSalesTraining"),
      description: t("about.productsSalesTrainingDesc"),
      benefits: [t("about.optimalSalesConsultations"), t("about.strategicIncentiveSystems")]
    },
    {
      image: "/new-images/Big Data vs. Smart Data.png",
      number: "03",
      title: t("about.bigData"),
      description: t("about.bigDataDesc"),
      benefits: [t("about.dailyDataUpdates"), t("about.realTimeInsights")]
    },
    {
      image: "/new-images/Optimal route planning.jpg",
      number: "04",
      title: t("about.routePlanning"),
      description: t("about.routePlanningDesc"),
      benefits: [t("about.strategicStoreVisits"), t("about.multiLanguageExpertise")]
    },
    {
      image: "/new-images/Last Minute Logistics.jpg",
      number: "05",
      title: t("about.lastMinuteLogistics"),
      description: t("about.lastMinuteLogisticsDesc"),
      benefits: [t("about.warehouse500m2"), t("about.onlineOrderingSolution")]
    },
    {
      image: "/new-images/Stationary Trade vs. E-commerce.webp",
      number: "06",
      title: t("about.stationaryTrade"),
      description: t("about.stationaryTradeDesc"),
      benefits: [t("about.multichannelSolutions"), t("about.retailExpertise")]
    }
  ]

    // Apply media overrides
    const aboutMedia = mediaOverrides.about || {}
    const updatedFeatures = baseFeatures.map((feature, index) => ({
      ...feature,
      image: aboutMedia[`factor${index}`] || feature.image
    }))

    setFeatures(updatedFeatures)
  }, [t, language, revision, mediaOverrides])

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

  return (
    <section id="about" ref={sectionRef} className="luxury-section bg-white pb-0">
      <div className="luxury-container">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
          {/* Left: Title */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
                    <h2 className="text-headline text-[#121830] mb-6 uppercase">
                      {t("about.title")}
                      <br />
                      <span className="text-[#2B2F36]">{t("about.titleHighlight")}</span>
                    </h2>
          </div>

          {/* Right: Description & CTA */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-luxury-body text-[#2B2F36] mb-8 leading-relaxed">
              {t("about.description")}
            </p>
                    <Link href="/contact" className="luxury-button luxury-button-primary font-bold text-lg flex items-center gap-3">
                      {t("about.scheduleCall")}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
          </div>
        </div>

                {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${(index + 2) * 150}ms` }}
            >
              {/* Card Container */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 md:h-[550px] flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-[#121830] font-bold text-xs">{feature.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Title */}
                  <h3 className="text-xl font-black text-[#121830] leading-tight uppercase">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-[#2B2F36] leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#FFCE5C] rounded-full flex-shrink-0"></div>
                        <span className="text-[#121830] font-medium text-sm">{benefit}</span>
                      </div>
                    ))}
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
