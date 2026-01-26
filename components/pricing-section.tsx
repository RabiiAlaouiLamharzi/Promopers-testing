"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
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
      name: "Basic Plan",
      price: { monthly: 199, yearly: 1990 },
      features: [
        "Logo Design",
        "Brand Guidelines",
        "Business Card Design",
        "Social Media Kit",
        "Email Support"
      ],
      isPopular: false
    },
    {
      name: "Premium Plan",
      price: { monthly: 399, yearly: 3990 },
      features: [
        "Everything in Basic",
        "Website Design",
        "UI/UX Design",
        "Brand Strategy",
        "Priority Support",
        "3 Revisions"
      ],
      isPopular: true
    },
    {
      name: "Ultimate Plan",
      price: { monthly: 499, yearly: 4990 },
      features: [
        "Everything in Premium",
        "Mobile App Design",
        "Animation Design",
        "Print Materials",
        "Dedicated Manager",
        "Unlimited Revisions"
      ],
      isPopular: false
    }
  ]

  return (
    <section ref={sectionRef} className="py-32 px-8 md:px-16 lg:px-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black uppercase mb-4">
            Simple Pricing
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Choose the perfect plan for your business needs
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-green-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isYearly ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-green-600' : 'text-gray-500'}`}>
              Yearly
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`relative p-8 rounded-2xl ${
                  plan.isPopular
                    ? 'bg-[#FFC72C] text-[#002855]'
                    : 'bg-white'
                } shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-4 uppercase">{plan.name}</h3>
                
                <div className="mb-8">
                  <span className="text-4xl font-black">${isYearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className="text-sm opacity-75">.00</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-3 flex-shrink-0">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`w-full py-3 rounded-lg font-bold transition-colors ${
                    plan.isPopular
                      ? 'bg-white text-[#FFC72C] hover:bg-gray-100'
                      : 'bg-[#FFC72C] text-[#002855] hover:bg-[#E6B526]'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
