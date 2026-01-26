"use client"

import { useEffect, useRef, useState } from "react"
import { useEdit } from "@/contexts/edit-context"
import { EditableImage } from "@/components/editable-image"

export function ImageCarouselsSectionEditable() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { editMode } = useEdit()
  const [mediaOverridesLoaded, setMediaOverridesLoaded] = useState<Record<string, string>>({})

  // Base image arrays
  const baseCocaColaImages = [
    "/new-images/coca-cola-image2.jpg",
    "/new-images/coca-cola-image3.jpg",
    "/new-images/coca-cola-image4.jpg",
    "/new-images/coca-cola-logo.png",
    "/new-images/coca-cola-image5.jpg",
    "/new-images/coca-cola-image6.jpeg",
    "/new-images/coca-cola-image7.jpg",
  ]

  const baseSamsungImages = [
    "/new-images/samsung-image1.jpg",
    "/new-images/samsung-image2.jpeg",
    "/new-images/samsung-image3.jpg",
    "/new-images/samsung-image4.jpg",
    "/new-images/samsung-image5.jpg",
    "/new-images/samsung-image6.jpg",
    "/new-images/samsung-logo.png",
  ]

  const baseHarmanImages = [
    "/new-images/harman-image1.jpg",
    "/new-images/harman-image2.jpg",
    "/new-images/harman-image3.png",
    "/new-images/harman-image4.jpg",
    "/new-images/harman-logo.png",
    "/new-images/harman-image5.jpg",
    "/new-images/harman-image6.png",
    "/new-images/harman-image7.jpg",
    "/new-images/harman-image8.png",
  ]

  // Coca-Cola carousel images (left to right) - Carousel 1
  const [cocaColaImages, setCocaColaImages] = useState(baseCocaColaImages)

  // Samsung carousel images (right to left) - Carousel 2
  const [samsungImages, setSamsungImages] = useState(baseSamsungImages)

  // Harman carousel images (left to right) - Carousel 3
  const [harmanImages, setHarmanImages] = useState(baseHarmanImages)

  // Load media overrides once on mount
  useEffect(() => {
    const loadMediaOverrides = async () => {
      try {
        const response = await fetch('/api/media')
        if (response.ok) {
          const data = await response.json()
          const carouselsMedia = data.carousels || {}
          console.log('[CarouselsEditable] Loaded media overrides:', carouselsMedia)
          setMediaOverridesLoaded(carouselsMedia)
          
          // Apply overrides to images
          if (Object.keys(carouselsMedia).length > 0) {
            setCocaColaImages(baseCocaColaImages.map((img, index) => 
              carouselsMedia[`cocacola${index}`] || img
            ))
            setSamsungImages(baseSamsungImages.map((img, index) => 
              carouselsMedia[`samsung${index}`] || img
            ))
            setHarmanImages(baseHarmanImages.map((img, index) => 
              carouselsMedia[`harman${index}`] || img
            ))
          }
        }
      } catch (error) {
        console.error('[CarouselsEditable] Error loading media overrides:', error)
      }
    }
    
    loadMediaOverrides()
  }, [])

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const updateCocaColaImage = (index: number, newSrc: string) => {
    const newImages = [...cocaColaImages]
    newImages[index] = newSrc
    setCocaColaImages(newImages)
    
    // Update media overrides state
    setMediaOverridesLoaded(prev => ({
      ...prev,
      [`cocacola${index}`]: newSrc
    }))
    console.log(`[CarouselsEditable] Updated Coca-Cola image ${index} to ${newSrc}`)
  }

  const updateSamsungImage = (index: number, newSrc: string) => {
    const newImages = [...samsungImages]
    newImages[index] = newSrc
    setSamsungImages(newImages)
    
    // Update media overrides state
    setMediaOverridesLoaded(prev => ({
      ...prev,
      [`samsung${index}`]: newSrc
    }))
    console.log(`[CarouselsEditable] Updated Samsung image ${index} to ${newSrc}`)
  }

  const updateHarmanImage = (index: number, newSrc: string) => {
    const newImages = [...harmanImages]
    newImages[index] = newSrc
    setHarmanImages(newImages)
    
    // Update media overrides state
    setMediaOverridesLoaded(prev => ({
      ...prev,
      [`harman${index}`]: newSrc
    }))
    console.log(`[CarouselsEditable] Updated Harman image ${index} to ${newSrc}`)
  }

  // Duplicate images for seamless infinite scroll
  const duplicateArray = (arr: string[], times: number) => {
    return Array(times).fill(arr).flat()
  }

  // Helper function to render carousel item (logo or image)
  const renderCarouselItem = (
    src: string, 
    alt: string, 
    isLogo: boolean = false, 
    onImageChange?: (newSrc: string) => void,
    mediaKey?: string
  ) => {
    return (
      <div
        className="flex-shrink-0 mx-1"
        style={{ minWidth: "300px", height: "200px", backgroundColor: "#002855" }}
      >
        {editMode ? (
          <EditableImage
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            editMode={editMode}
            onImageChange={onImageChange}
            section="carousels"
            mediaKey={mediaKey}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <section ref={sectionRef} className="py-2 overflow-hidden" style={{ backgroundColor: "#002855" }}>
      <div className="w-full">
        {/* First Carousel - Coca-Cola - Left to Right */}
        <div className="mb-2">
          <div className="relative overflow-hidden">
            <div
              className={`flex animate-scroll transition-all duration-1500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animationDelay: "0.5s",
                animationDuration: isMobile ? "80s" : "120s",
                width: "200%"
              }}
            >
              {duplicateArray(cocaColaImages, 4).map((image, index) => {
                const isLogo = image.includes("logo")
                const originalIndex = index % cocaColaImages.length
                return (
                  <div key={`coca-cola-${index}`}>
                    {renderCarouselItem(
                      image, 
                      `Coca-Cola ${isLogo ? 'Logo' : `Image ${(index % (cocaColaImages.length - 1)) + 1}`}`, 
                      isLogo,
                      (newSrc) => updateCocaColaImage(originalIndex, newSrc),
                      `cocacola${originalIndex}`
                    )}
                </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Second Carousel - Samsung - Right to Left */}
        <div className="mb-2">
          <div className="relative overflow-hidden">
            <div
              className={`flex animate-scroll-reverse transition-all duration-1500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animationDelay: "0.5s",
                animationDuration: isMobile ? "80s" : "120s",
                width: "200%"
              }}
            >
              {duplicateArray(samsungImages, 4).map((image, index) => {
                const isLogo = image.includes("logo")
                const originalIndex = index % samsungImages.length
                return (
                  <div key={`samsung-${index}`}>
                    {renderCarouselItem(
                      image, 
                      `Samsung ${isLogo ? 'Logo' : `Image ${(index % (samsungImages.length - 1)) + 1}`}`, 
                      isLogo,
                      (newSrc) => updateSamsungImage(originalIndex, newSrc),
                      `samsung${originalIndex}`
                    )}
                </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Third Carousel - Harman - Left to Right */}
        <div>
          <div className="relative overflow-hidden">
            <div
              className={`flex animate-scroll transition-all duration-1500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animationDelay: "0.5s",
                animationDuration: isMobile ? "80s" : "120s",
                width: "200%"
              }}
            >
              {duplicateArray(harmanImages, 4).map((image, index) => {
                const isLogo = image.includes("logo")
                const originalIndex = index % harmanImages.length
                return (
                  <div key={`harman-${index}`}>
                    {renderCarouselItem(
                      image, 
                      `Harman ${isLogo ? 'Logo' : `Image ${(index % (harmanImages.length - 1)) + 1}`}`, 
                      isLogo,
                      (newSrc) => updateHarmanImage(originalIndex, newSrc),
                      `harman${originalIndex}`
                    )}
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

