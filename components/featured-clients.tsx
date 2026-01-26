"use client"

import { useEffect, useRef, useState } from "react"

const clients = [
  { name: "Coca-Cola", logo: "/coca-cola-logo.png" },
  { name: "Nestlé", logo: "/nestle-logo.jpg" },
  { name: "Lindt", logo: "/lindt-logo.jpg" },
  { name: "Rolex", logo: "/rolex-logo.png" },
  { name: "Nespresso", logo: "/nespresso-logo.jpg" },
  { name: "Victorinox", logo: "/victorinox-logo.jpg" },
  { name: "Samsung", logo: "/placeholder-logo.png" },
  { name: "L'Oréal", logo: "/placeholder-logo.png" },
]

export function FeaturedClients() {
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

  // Duplicate clients for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients, ...clients]

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-center text-xs font-bold tracking-widest text-gray-500 mb-16 uppercase transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Trusted by Leading Swiss Brands
        </h2>
        
        {/* Infinite Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll hover:animate-pause w-[300%]">
            {duplicatedClients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="w-32 h-16 flex items-center justify-center">
                  <img 
                    src={client.logo || "/placeholder.svg"} 
                    alt={client.name} 
                    className="w-full h-full object-contain filter brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-300" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
