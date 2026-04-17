"use client"

import { useEffect, useRef, useState } from "react"

export function MissionStatement() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-black uppercase leading-none mb-8 md:mb-12 lg:mb-16">
              What People Says
            </h2>

            {/* Portrait */}
            <div className="relative rounded-2xl overflow-hidden">
              <img src="/professional-portrait.png" alt="Testimonial" className="w-full h-64 md:h-80 lg:h-[500px] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <p className="text-white font-bold mb-1">Samantha Bloom</p>
                <p className="text-white/80 text-sm">Marketing Director at Innovatech</p>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col justify-between transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex justify-end mb-6 md:mb-8">
              <button className="w-10 h-10 md:w-12 md:h-12 luxury-button luxury-button-primary rounded-full flex items-center justify-center">
                <span className="text-[#002855] font-bold text-lg md:text-xl">→</span>
              </button>
            </div>

            <div>
              <div className="text-4xl md:text-6xl lg:text-8xl font-bold text-black mb-4 md:mb-6 lg:mb-8">"</div>
              <blockquote className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-black leading-relaxed mb-6 md:mb-8">
                Working with Sandro Design Agency was a game-changer for our brand. Their team understood our vision and
                transformed it into a cohesive, visually stunning identity. The level of creativity, attention to
                detail, and customer support was exceptional. Our brand recognition and customer engagement have
                significantly improved since the rebrand.
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full" />
                <div>
                  <p className="font-bold text-black">Samantha Bloom</p>
                  <p className="text-sm text-gray-600">Marketing Director</p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex gap-2 mt-8">
                <div className="w-3 h-3 bg-black rounded-full" />
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
