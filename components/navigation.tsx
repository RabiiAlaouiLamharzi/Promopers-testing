"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navigation() {
  const [isInHero, setIsInHero] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const isHomePage = pathname === "/"

  useEffect(() => {
    // On non-home pages, always use old navbar style
    if (!isHomePage) {
      setIsInHero(false)
      return
    }

    // Only on home page, use scroll-based logic
    const handleScroll = () => {
      // Hero section is 100vh, so check if scroll position is less than viewport height
      const heroHeight = window.innerHeight
      setIsInHero(window.scrollY < heroHeight - 100) // 100px threshold for smooth transition
    }
    
    // Check initial state
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/references", label: t("nav.references") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
    { href: "https://promopers.staff.cloud/recruiting", label: t("nav.application"), external: true },
    { href: "https://saas.retaildashboard.io/site/login", label: t("nav.customersLogin"), external: true },
  ]

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 w-screen">
        <nav className="relative transition-all duration-500 w-full flex justify-center">
          <div className={`rounded-full px-nav-small h-20 flex items-center justify-between transition-all duration-500 w-[90%] ${
              isInHero 
                ? "bg-transparent" 
                : "glass-effect shadow-lg"
            }`}>
          <Link href="/" className="flex items-center">
            <img 
              src="/images/logo-pp.png" 
              alt="PromoPers Logo" 
                className={`w-10 h-10 object-contain transition-all duration-500 ${
                  isInHero ? "brightness-0 invert" : ""
                }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden min-[1320px]:flex items-center gap-8">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                    className={`text-sm font-medium transition-colors duration-200 cursor-default ${
                      isInHero 
                        ? "text-white hover:text-[#FFC72C]" 
                        : "text-[#002855] hover:text-[#FFC72C]"
                    }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                    className={`text-sm font-medium transition-colors duration-200 cursor-default ${
                      isInHero 
                        ? "text-white hover:text-[#FFC72C]" 
                        : "text-[#002855] hover:text-[#FFC72C]"
                    }`}
                >
                  {link.label}
                </Link>
              )
            ))}
              <LanguageSwitcher isInHero={isInHero} />
              <a 
                href="https://promopers.staff.cloud/auth/employee/login" 
                className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
                  isInHero
                    ? "border-2 border-white/30 text-white hover:bg-white/10"
                    : "bg-[#002855] text-white hover:bg-[#003D7A]"
                }`}
              >
              {t("nav.promoPersLogin")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`min-[1320px]:hidden p-2 rounded-full transition-colors ${
                isInHero
                  ? "text-white hover:bg-white/20"
                  : "text-[#002855] hover:bg-[#002855]/10"
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
      <div
                className="fixed inset-0 z-40 bg-black/20 min-[1320px]:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-[20px] mr-[20px] z-50 min-[1320px]:hidden">
                <div className="glass-effect shadow-lg rounded-2xl p-4 space-y-3 w-64">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-[#002855] hover:text-[#FFC72C] transition-colors py-2"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-[#002855] hover:text-[#FFC72C] transition-colors py-2"
              >
                {link.label}
              </Link>
            )
          ))}
                  
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex justify-center">
                      <LanguageSwitcher isInHero={false} />
                    </div>
            <a
              href="https://promopers.staff.cloud/auth/employee/login"
              onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 rounded-full bg-[#002855] text-white font-bold text-sm hover:bg-[#003D7A] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {t("nav.promoPersLogin")}
                      <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  )
}
