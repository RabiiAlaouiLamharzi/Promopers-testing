"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

export function ClientsSection() {
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

  const clients = [
    { name: "Coca Cola", logo: "/coca-cola-logo.png" },
    { name: "Lindt", logo: "/lindt-logo.jpg" },
    { name: "Nestlé", logo: "/nestle-logo.jpg" },
    { name: "Nespresso", logo: "/nespresso-logo.jpg" },
    { name: "Rolex", logo: "/rolex-logo.png" },
    { name: "Victorinox", logo: "/victorinox-logo.jpg" },
    { name: "Samsung", logo: "/placeholder-logo.png" },
    { name: "L'Oréal", logo: "/placeholder-logo.png" },
    { name: "JBL", logo: "/placeholder-logo.png" },
    { name: "Harman", logo: "/placeholder-logo.png" },
    { name: "Peace Tea", logo: "/placeholder-logo.png" },
    { name: "Modern Building", logo: "/placeholder-logo.png" },
  ]

  return (
    <section ref={sectionRef} className="luxury-section premium-gradient">
      <div className="luxury-container">
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#121830] rounded-full text-white text-sm font-medium mb-8">
              <div className="w-2 h-2 rounded-full bg-[#FFCE5C]" />
              Trusted Partners
            </div>
              Trusted Partners
            </div>
            <h2 className="text-headline text-black mb-8 uppercase">
              Our Clients
            </h2>
            <p className="text-luxury-large text-gray-600 max-w-4xl mx-auto mb-6">
              20 years of full service Agency experience
            </p>
            <p className="text-luxury-body text-gray-500 max-w-2xl mx-auto">
              All thanks to the trust of our long-standing customers
            </p>
          </div>
        </div>

        <div
          className={`luxury-grid luxury-grid-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {clients.map((client, index) => (
            <div
              key={index}
              className="group luxury-hover transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="glass-effect rounded-3xl p-8 text-center luxury-border h-32 flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-16 w-auto opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="inline-flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full luxury-border">
            <div className="w-8 h-8 bg-[#FFCE5C] rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-[#121830]" />
            </div>
            <span className="text-sm font-medium text-gray-700">Swiss Quality Assurance</span>
          </div>
        </div>
      </div>
    </section>
  )
}
