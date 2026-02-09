"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Users, Star, CreditCard, Cloud, Settings } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function FloatingFeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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

  const features = [
    {
      icon: <TrendingUp className="w-4 h-4 text-white" />,
      text: t("floatingFeatures.increaseRevenue"),
      side: "left",
      offset: "top",
      animation: "float1",
      duration: "4.2s",
      xOffset: "left-2",
      yOffset: "top-2"
    },
    {
      icon: <Users className="w-4 h-4 text-white" />,
      text: t("floatingFeatures.feelConfident"),
      side: "left",
      offset: "middle",
      animation: "float2",
      duration: "5.1s",
      xOffset: "-left-12",
      yOffset: "top-1/2 transform -translate-y-1/2"
    },
    {
      icon: <Star className="w-4 h-4 text-white" />,
      text: t("floatingFeatures.impressClients"),
      side: "right",
      offset: "top",
      animation: "float3",
      duration: "3.8s",
      xOffset: "right-14",
      yOffset: "top-2"
    },
    {
      icon: <CreditCard className="w-4 h-4 text-white" />,
      text: t("floatingFeatures.acceptOnlinePayments"),
      side: "left",
      offset: "bottom",
      animation: "float4",
      duration: "4.7s",
      xOffset: "left-2",
      yOffset: "bottom-12"
    },
    {
      icon: <Cloud className="w-4 h-4 text-white" />,
      text: t("floatingFeatures.cloudBasedAPI"),
      side: "right",
      offset: "middle",
      animation: "float5",
      duration: "3.4s",
      xOffset: "-right-8",
      yOffset: "top-1/2 transform -translate-y-1/2"
    },
    {
      icon: <Settings className="w-4 h-4 text-white" />,
      text: t("floatingFeatures.easilyCustomised"),
      side: "right",
      offset: "bottom",
      animation: "float6",
      duration: "4.9s",
      xOffset: "right-6",
      yOffset: "bottom-10"
    }
  ]


  const getTagPosition = (feature: any) => {
    return `${feature.xOffset} ${feature.yOffset}`
  }

  return (
    <section id="features" ref={sectionRef} className="luxury-section bg-white relative overflow-visible">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white via-transparent to-transparent opacity-50" />
      </div>

      <div className="luxury-container relative z-4">
        {/* Central Content */}
        <div className="relative flex items-center justify-center min-h-[300px]">
          {/* Central Text */}
          <div
            className={`text-center relative z-10 transition-all duration-1500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-headline text-[#002855] mb-8 uppercase px-0 md:px-[20%]">
              {t("floatingFeatures.title")}
            </h2>
            <p className="text-luxury-large text-[#003D7A] max-w-3xl mx-auto leading-relaxed">
              {t("floatingFeatures.description")}
            </p>
          </div>

          {/* Side Tags */}
          {features.map((feature, index) => (
            <div
              key={index}
              className={`absolute ${getTagPosition(feature)} transition-all duration-1500 max-[1299px]:hidden ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                animation: isVisible ? `${feature.animation} ${feature.duration} ease-in-out infinite` : 'none',
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="bg-white rounded-full px-4 py-3 border border-gray-200 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-[#FFC72C] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#E6B526] transition-colors duration-300">
                    {feature.icon}
                  </div>
                  
                  {/* Text */}
                  <span className="text-[#002855] font-medium text-xs lg:text-sm whitespace-nowrap">
                    {feature.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
