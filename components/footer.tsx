'use client'

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-white w-full">
      <div className="w-full px-6 md:px-16 lg:px-24 py-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12 w-full">
          {/* Left Section - Company Info */}
          <div className="lg:max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo-pp.png"
                alt="PromoPers Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-black">PROMOPERS</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed italic text-left">
              {t("footer.description")}
            </p>
          </div>

          {/* Navigation Columns - Right Side */}
          <div className="flex flex-row gap-16 md:gap-32 lg:gap-48">
            {/* Company */}
            <div className="text-left">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wide text-black">{t("footer.company")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/references" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.references")}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.blog")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.contact")}
                  </Link>
                </li>
                <li>
                  <a href="https://promopers.staff.cloud/recruiting" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.application")}
                  </a>
                </li>
                <li>
                  <a href="https://saas.retaildashboard.io/site/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.customersLogin")}
                  </a>
                </li>
                <li>
                  <a href="https://promopers.staff.cloud/auth/employee/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("nav.promoPersLogin")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-left">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wide text-black">{t("footer.legal")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("footer.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/imprint" className="text-sm text-gray-600 hover:text-black transition-colors">
                    {t("footer.imprint")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              {t("footer.copyright")}
            </div>
            <div className="text-sm text-gray-500">
              <Link href="/admin" className="text-gray-600 hover:text-black transition-colors">
                {t("footer.adminPage")}
              </Link>
            </div>
          </div>
          
          {/* Created by credit */}
          <div className="text-left mt-6">
            <p className="text-xs text-gray-400">
              {t("footer.createdBy")} <a href="https://lumacraft-agency.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">Luma Craft Agency</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
