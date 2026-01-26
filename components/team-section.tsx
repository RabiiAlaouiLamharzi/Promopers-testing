"use client"

import { useEffect, useRef, useState } from "react"

export function TeamSection() {
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

  const caseStudies = [
    {
      title: "NESTLÉ",
      subtitle: "Summer Campaign Success",
      image: "/nestle-retail-display-summer-campaign.jpg",
    },
    {
      title: "LINDT",
      subtitle: "Premium Retail Display",
      image: "/lindt-chocolate-retail-display.jpg",
    },
    {
      title: "SAMSUNG",
      subtitle: "Product Launch Event",
      image: "/samsung-product-launch-event.jpg",
    },
    {
      title: "L'ORÉAL",
      subtitle: "Beauty Activation",
      image: "/loreal-beauty-event-activation.jpg",
    },
  ]

  return (
    <section id="team" ref={sectionRef} className="py-32 px-6 md:px-16 lg:px-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black uppercase leading-none">
              Success Stories
              <br />
              That Inspire Action!
            </h2>
          </div>

          <div
            className={`flex items-center justify-end gap-4 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <p className="text-sm text-gray-600 max-w-md">
              Discover insights, trends, and success stories from our retail activation campaigns that will inspire your next brand experience.
            </p>
            <button className="w-14 h-14 luxury-button luxury-button-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#002855] font-bold text-xl">→</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {caseStudies.map((caseStudy, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img
                  src={caseStudy.image || "/placeholder.svg"}
                  alt={caseStudy.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#FFC72C] text-[#002855] text-xs font-bold px-4 py-2 rounded-full">
                    {caseStudy.title}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{caseStudy.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
