"use client"

import { useEffect, useRef, useState } from "react"

export function LogoCarousel() {
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

  const logos = [
    { name: "Coca-Cola", src: "/images/coke.png" },
    { name: "DeLonghi", src: "/images/del.png" },
    { name: "PlayStation", src: "/images/playstation.png" }
  ]

  // Duplicate logos multiple times for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <section ref={sectionRef} className="py-16 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFC72C 0%, #E6B526 50%, #FFC72C 100%)' }}>
      <div className="w-full px-0">
        {/* Logo Carousel */}
        <div className="relative overflow-hidden">
          <div
            className={`flex animate-scroll transition-all duration-1500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              animationDelay: "0.5s",
              animationDuration: "20s",
              width: "200%"
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 mx-6 flex items-center justify-center"
                style={{ minWidth: "140px" }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-20 w-auto object-contain filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
