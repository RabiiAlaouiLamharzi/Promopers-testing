"use client"

import { useEffect, useRef, useState } from "react"

export function ReferencesCarousel() {
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

  const plans = [
    {
      name: "BASIC PLAN",
      price: "$189.00",
      features: ["Free brand assessment", "Comprehensive audit", "Tailored strategy", "Ongoing support"],
      highlight: false,
    },
    {
      name: "PREMIUM KIT",
      price: "$369.00",
      features: [
        "Free brand assessment",
        "Comprehensive audit",
        "Tailored strategy",
        "Ongoing support",
        "Priority access",
        "Advanced analytics",
      ],
      highlight: true,
    },
    {
      name: "ULTIMATE PLAN",
      price: "$499.00",
      features: [
        "Free brand assessment",
        "Comprehensive audit",
        "Tailored strategy",
        "Ongoing support",
        "Dedicated manager",
      ],
      highlight: false,
    },
  ]

  return (
    <section id="references" ref={sectionRef} className="py-32 px-8 md:px-16 lg:px-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <h2
          className={`text-headline text-black text-center mb-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Simple Pricing
        </h2>
        <div
          className={`flex justify-center mb-20 transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button className="w-14 h-14 luxury-button luxury-button-primary rounded-full flex items-center justify-center">
            <span className="text-[#002855] font-bold text-xl">→</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-10 transition-all duration-1000 ${
                plan.highlight ? "bg-[#FFC72C] text-[#002855] scale-105 shadow-2xl" : "bg-white shadow-lg"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="text-xs font-bold tracking-[0.2em] mb-12 text-black">{plan.name}</h3>
              <div className="mb-12">
                <span className="text-6xl font-black text-black">{plan.price}</span>
              </div>
              <ul className="space-y-5 mb-12">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-black">
                    <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-full font-bold transition-colors ${
                  plan.highlight ? "bg-black text-white hover:bg-gray-800" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
