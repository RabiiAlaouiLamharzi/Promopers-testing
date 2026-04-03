'use client'

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-white w-full">
      <div className="w-full px-6 md:px-16 lg:px-24 py-16">

        {/* Logo — centered */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo-pp.png"
              alt="PromoPers Logo"
              className="w-14 h-14 object-contain"
            />
            <span className="text-3xl font-bold text-black tracking-tight">PromoPers</span>
          </div>
        </div>

        {/* Horizontal nav links — centered */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">
            {t("nav.contact")}
          </Link>
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">
            {t("footer.privacyPolicy")}
          </Link>
          <Link href="/imprint" className="text-sm text-gray-600 hover:text-black transition-colors">
            {t("footer.imprint")}
          </Link>
        </nav>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-black transition-colors">
              {t("footer.adminPage")}
            </Link>
            <span className="text-gray-300">·</span>
            <p className="text-xs text-gray-400">
              {t("footer.createdBy")} <a href="https://lumacraft-agency.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Luma Craft Agency</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
