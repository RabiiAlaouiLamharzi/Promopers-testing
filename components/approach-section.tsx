"use client"

import { useEffect, useRef, useState } from "react"

export function ApproachSection() {
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

  const projects = [
    {
      title: "IPSUM",
      subtitle: "The Power of a Strong Experiential Event",
      image: "/modern-building-architecture-with-ipsum-branding.jpg",
      size: "large",
    },
    {
      title: "New Year Card Logo",
      image: "/laptop-showing-design-mockup-on-desk.jpg",
      size: "medium",
    },
    {
      title: "Designing for Trust & Credibility",
      image: "/smartphone-app-design-mockup.jpg",
      size: "medium",
    },
    {
      title: "Consistency Across Platforms",
      image: "/product-packaging-box-design.jpg",
      size: "medium",
    },
    {
      title: "Intuitive Testing & Branding",
      image: "/website-design-on-computer-screen.jpg",
      size: "medium",
    },
  ]

  return (
    <section ref={sectionRef} className="py-32 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h2 className="text-headline text-black mb-4">Insightful Works</h2>
            <h3 className="text-subheadline text-gray-300">Spark Creativity</h3>
          </div>

          <div
            className={`flex items-start justify-between gap-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <p className="text-sm text-gray-600 leading-relaxed max-w-md pt-4">
              Explore our portfolio of innovative designs and successful brand activations that have helped businesses
              thrive in competitive markets.
            </p>
            <button className="w-14 h-14 luxury-button luxury-button-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#002855] font-bold text-xl">→</span>
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large featured project */}
          <div
            className={`lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden group transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <img
              src={projects[0].image || "/placeholder.svg"}
              alt={projects[0].title}
              className="w-full h-full object-cover min-h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h3 className="text-5xl font-black text-white mb-3">{projects[0].title}</h3>
              <p className="text-white/90 mb-6 text-sm">{projects[0].subtitle}</p>
              <button className="w-14 h-14 luxury-button luxury-button-primary rounded-full flex items-center justify-center">
                <span className="text-[#002855] font-bold text-xl">→</span>
              </button>
            </div>
          </div>

          {/* Smaller projects */}
          {projects.slice(1).map((project, index) => (
            <div
              key={project.title}
              className={`relative rounded-3xl overflow-hidden group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover min-h-[280px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-sm mb-4">{project.title}</p>
                <button className="w-12 h-12 luxury-button luxury-button-primary rounded-full flex items-center justify-center">
                  <span className="text-[#002855] font-bold">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
