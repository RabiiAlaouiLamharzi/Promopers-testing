"use client"

import { useEffect, useRef, useState } from "react"
const MIN_DISPLAY_MS = 2200 // Stay visible until app has settled (avoids old → new flash)
const FADE_DURATION_MS = 400

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const mountedAt = useRef<number>(Date.now())
  const hideScheduled = useRef(false)

  useEffect(() => {
    if (typeof document === "undefined" || hideScheduled.current) return

    function hideLoader() {
      if (hideScheduled.current) return
      hideScheduled.current = true
      setFadeOut(true)
      const t = setTimeout(() => setVisible(false), FADE_DURATION_MS)
      return () => clearTimeout(t)
    }

    function tryHide() {
      const elapsed = Date.now() - mountedAt.current
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
      if (remaining > 0) {
        setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(hideLoader)), remaining)
      } else {
        requestAnimationFrame(() => requestAnimationFrame(hideLoader))
      }
    }

    if (document.readyState === "complete") {
      tryHide()
      return
    }

    const onLoad = () => tryHide()
    window.addEventListener("load", onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [])

  if (!visible) return null

  return (
    <div
      className="loading-screen-overlay"
      data-fade-out={fadeOut ? "true" : undefined}
      aria-hidden="true"
    >
      <div className="loading-screen-content">
        <div className="loading-screen-logo-wrap" aria-hidden="true" />
        <div className="loading-screen-bar">
          <div className="loading-screen-bar-fill" />
        </div>
      </div>
    </div>
  )
}
