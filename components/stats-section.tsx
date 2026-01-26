"use client"

import { useEffect, useRef, useState } from "react"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const stats = [
    {
      number: "1937",
      label: "Filialen",
      sublabel: "Branches",
      description: "in our internal\ndatabase"
    },
    {
      number: "44314",
      label: "Sales Promotionen",
      sublabel: "Sales promotions",
      description: "in the last 10 years"
    },
    {
      number: "53",
      label: "zufriedene Kunden",
      sublabel: "satisfied customers",
      description: "in long-term customer relationship"
    }
  ]

  return (
    <section ref={sectionRef} className="luxury-section premium-gradient">
      <div className="luxury-container">
        <div className="luxury-grid luxury-grid-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group luxury-hover transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              <div className="glass-effect rounded-3xl p-12 text-center luxury-border">
                {/* Number */}
                <div className="mb-8">
                  <div className="text-7xl md:text-8xl font-black text-[#FFC72C] mb-4 leading-none">
                    {stat.number}
                  </div>
                  <div className="h-1 w-16 bg-[#FFC72C] mx-auto rounded-full" />
                </div>

                {/* Labels */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {stat.label}
                  </h3>
                  <h4 className="text-lg font-medium text-gray-600 mb-4">
                    {stat.sublabel}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-luxury-body max-w-sm mx-auto">
                  {stat.description}
                </p>

                {/* Decorative Element */}
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 bg-[#FFC72C]/20 rounded-full mx-auto flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#002855] rounded-full" />
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
