"use client"

import { useEffect, useState } from "react"

export function HeroSection() {
  const [videoUrl, setVideoUrl] = useState("/video/promopers.mp4")

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => { if (data?.hero?.videoUrl) setVideoUrl(data.hero.videoUrl) })
      .catch(() => {})
  }, [])

  return (
    <section id="home" className="fixed top-0 left-0 w-full overflow-hidden" style={{ height: "100vh", zIndex: 0 }}>
      {/* Full-screen video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          key={videoUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-[#001833]/50" />
      </div>

    </section>
  )
}