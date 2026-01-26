"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

const AUTH_STORAGE_KEY = "admin_authenticated"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Only check auth on client side after mount
    if (typeof window === "undefined") return

    const checkAndRedirect = () => {
      try {
    const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true"
    const isMainAdminPage = pathname === "/admin"
    
    // If not authenticated and trying to access a subpage, redirect to main admin page
    if (!isAuthenticated && !isMainAdminPage) {
          router.replace("/admin") // Use replace instead of push to avoid history issues
        }
      } catch (error) {
        console.error('[AdminLayout] Error checking auth:', error)
      }
    }

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(checkAndRedirect, 100)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Show nothing while mounting to prevent flash
  if (!mounted) {
    return null
  }

  return <>{children}</>
}

