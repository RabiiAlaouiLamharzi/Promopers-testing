"use client"

import { useEffect, useState } from "react"

export function ImageCarousel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Only Coca-Cola images for the first carousel (with Harman image 4)
  const images = [
    "/new-images/coca-cola-image2.jpg",
    "/new-images/coca-cola-image3.jpg",
    "/new-images/coca-cola-image4.jpg",
    "/new-images/harman-image4.jpg",
    "/new-images/coca-cola-image5.jpg",
    "/new-images/coca-cola-image6.jpeg",
    "/new-images/coca-cola-image7.jpg",
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Duplicate images multiple times for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images, ...images]

  return (
    <div className="relative w-full overflow-hidden">
      <div className="w-full">
        {/* Image Carousel */}
        <div className="relative overflow-hidden">
          <div
            className={`flex animate-scroll transition-all duration-1500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              animationDelay: "0.5s",
              animationDuration: isMobile ? "20s" : "30s", // Faster on mobile
              width: "200%" // Adjusted width for 4 duplicates
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="flex-shrink-0 mx-4 flex items-center justify-center"
                style={{ minWidth: "300px" }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg w-[400px] h-[300px]">
                  <img
                    src={image}
                    alt={`Marketing Event ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
