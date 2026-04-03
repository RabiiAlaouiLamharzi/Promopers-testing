"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import ReactCountryFlag from "react-country-flag"
import { useLanguage } from "@/contexts/language-context"
import { languages, Language } from "@/lib/i18n"
import { usePathname } from "next/navigation"

const langToCountry: Record<Language, string> = {
  en: "GB",
  fr: "FR",
  de: "DE",
  it: "IT",
}

const langNames: Record<Language, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/team", label: "Team" },
  { href: "/references", label: "References" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const solidNavPages = [
    "/admin",
    "/admin/edit/reference",
    "/admin/edit/blog",
    "/admin/edit/testimonial",
    "/admin/edit/job",
    "/admin/team",
  ]
  const isAdmin = solidNavPages.includes(pathname)

  useEffect(() => {
    // Specific admin pages always use solid navbar — no scroll logic needed.
    if (isAdmin) {
      setIsPastHero(true)
      return
    }
    const handleScroll = () => {
      // On the home page: switch after the full-height hero.
      // On all other pages: switch as soon as the user scrolls at all (50px).
      const threshold = isHome ? window.innerHeight - 80 : 50
      setIsPastHero(window.scrollY > threshold)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHome, isAdmin])

  const closeAll = () => {
    setIsMenuOpen(false)
    setIsLangOpen(false)
  }

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className={`fixed top-0 left-0 right-0 z-50 h-28 flex items-center justify-between px-16 transition-all duration-300 ${
        isPastHero ? "bg-white shadow-md" : "bg-transparent"
      }`}>
        {/* Logo */}
        <Link href="/" onClick={closeAll} className="flex items-center gap-4">
          <img
            src="/images/logo-pp.png"
            alt="PromoPers"
            className={`w-7 h-7 object-contain transition-all duration-300 ${isPastHero ? "" : "brightness-0 invert"}`}
          />
          <span
            className={`tracking-tight transition-colors duration-300 ${
              isPastHero ? "text-[#002855]" : "text-white"
            }`}
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", lineHeight: 1, fontWeight: 600 }}
          >
            PromoPers
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-6 select-none">
          {/* MENU + hamburger */}
          <button
            onClick={() => { setIsMenuOpen(!isMenuOpen); setIsLangOpen(false) }}
            className={`flex items-center gap-2.5 font-semibold text-base uppercase tracking-widest transition-colors ${
              isPastHero
                ? "text-[#002855] hover:text-[#FFC72C]"
                : "text-white hover:text-[#FFC72C]"
            }`}
            aria-label="Toggle menu"
          >
            <span className="leading-none">Menu</span>
            {isMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>

          {/* Separator */}
          <span className={`font-thin text-xl leading-none transition-colors duration-300 ${isPastHero ? "text-[#002855]/30" : "text-white/30"}`}>|</span>

          {/* Language flag */}
          <div className="relative">
            <button
              onClick={() => { setIsLangOpen(!isLangOpen); setIsMenuOpen(false) }}
              className="flex items-center hover:scale-110 transition-transform"
              aria-label="Change language"
            >
              <ReactCountryFlag
                countryCode={langToCountry[language]}
                svg
                style={{ width: "1.8rem", height: "1.8rem", borderRadius: "4px", display: "block" }}
              />
            </button>

            {/* Language dropdown */}
            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 top-full mt-3 z-50 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 w-44">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        language === lang
                          ? "bg-[#002855] text-white"
                          : "text-[#002855] hover:bg-gray-50"
                      }`}
                    >
                      <ReactCountryFlag
                        countryCode={langToCountry[lang]}
                        svg
                        style={{ width: "1.25rem", height: "1.25rem", borderRadius: "2px" }}
                      />
                      <span>{langNames[lang]}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Drawer backdrop ─────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* ── Drawer panel ────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-[340px] bg-white flex flex-col transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100">
          <Link href="/" onClick={closeAll} className="flex items-center gap-2">
            <img src="/images/logo-pp.png" alt="PromoPers" className="w-8 h-8 object-contain" />
            <span className="text-[#002855] tracking-tight text-xl" style={{ fontWeight: 600 }}>PromoPers</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-[#002855] hover:text-[#FFC72C] transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center px-10 gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeAll}
              className="group flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-[#002855] text-2xl font-semibold tracking-tight group-hover:text-[#FFC72C] transition-colors duration-200">
                {link.label}
              </span>
              <span className="text-gray-300 group-hover:text-[#FFC72C] transition-colors duration-200 text-lg">
                →
              </span>
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-10 py-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 tracking-wide">X-Tool Services (Schweiz) AG</p>
        </div>
      </div>
    </>
  )
}
