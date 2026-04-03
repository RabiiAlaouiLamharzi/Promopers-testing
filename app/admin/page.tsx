"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { FileText } from "lucide-react"

const ADMIN_PASSWORD = "promopers00001111"
const AUTH_STORAGE_KEY = "admin_authenticated"

export default function AdminHomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored === "true") {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } else {
      // On server side, default to not authenticated
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      // Store authentication in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, "true")
      }
    } else {
      setError("Incorrect password")
      setPassword("")
    }
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#FFC72C] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#002855] mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-[#002855] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#003D7A] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // User is authenticated, show admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl" style={{ marginTop: '120px' }}>
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-black text-[#002855] uppercase mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
          This admin section allows you to create, edit, and manage your reference articles. You can add rich text content, images, videos, and translations for multiple languages.
          </p>
        </div>
        <br />

        {/* Admin Links */}
        <div className="space-y-4">
          <Link 
            href="/admin/home"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Home Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit entire homepage - hero, features, stats, and all sections
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/about"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  About Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit entire about page - hero, intro, vision, timeline, team, and all sections
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/blog"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Blog Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit blog page - hero section, CTA, and page content
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/references"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  References Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit references page - hero section, intro, and CTA sections
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/contact"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Contact Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit contact page - hero, contact info, form labels, and CTA sections
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/imprint"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Imprint Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit imprint page - all legal text, company info, and disclaimer content
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/privacy"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FFC72C]"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#002855]" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Privacy Page
                </h2>
                <p className="text-gray-600 text-sm">
                  Edit privacy policy page - all privacy policy text, GDPR rights, and legal content
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/edit/reference"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Add/Update/Delete References
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage reference articles and client projects
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/edit/blog"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-purple-500" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Add/Update/Delete Blog Articles
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage blog articles and news posts
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/edit/testimonial"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-orange-500" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Add/Update/Delete Testimonials
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage client testimonials and reviews
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/edit/job"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-teal-500"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-teal-500" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Add/Update/Delete Job Offers
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage office job listings shown on the career page
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/admin/team"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-green-500" />
              <div>
                <h2 className="text-xl font-bold text-[#002855] mb-1">
                  Manage Team Members
                </h2>
                <p className="text-gray-600 text-sm">
                  Add, edit, or remove team members from the about page
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

