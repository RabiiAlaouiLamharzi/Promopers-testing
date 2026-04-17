"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function ImprintPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <section className="py-20 bg-white relative overflow-hidden">
          <BackgroundDots />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
            <article className="legal-article max-w-none">
              <h2 id="contact">{t("imprint.contact")}</h2>
              <p>
                <strong>{t("imprint.companyName")}</strong><br />
                {t("imprint.companyAddress")}<br />
                {t("imprint.companyCity")}<br />
                {t("imprint.country")}
              </p>
              <p>
                {t("imprint.email")} <a href="mailto:info@promopers.com">info@promopers.com</a>
              </p>
              <hr />

              <h2 id="representatives">{t("imprint.representatives")}</h2>
              <p>{t("imprint.representativesText")}<br />{t("imprint.representativesText2")}</p>
              <hr />

              <h2 id="register">{t("imprint.register")}</h2>
              <p>
                {t("imprint.registerName")}<br />
                {t("imprint.registerNumber")}
              </p>
              <hr />

              <h2 id="vat">{t("imprint.vat")}</h2>
              <p>{t("imprint.vatNumber")}</p>
              <hr />

              <h2 id="disclaimer">{t("imprint.disclaimer")}</h2>
              <p>
                {t("imprint.disclaimerText1")}
              </p>
              <p>
                {t("imprint.disclaimerText2")}
              </p>
              <p>
                {t("imprint.disclaimerText3")}
              </p>
              <hr />

              <h2 id="links">{t("imprint.links")}</h2>
              <p>
                {t("imprint.linksText")}
              </p>
              <hr />

              <h2 id="copyrights">{t("imprint.copyrights")}</h2>
              <p>
                {t("imprint.copyrightsText")}
              </p>
            </article>
            <style jsx>{`
              .legal-article {
                font-family: var(--font-poppins), 'Poppins', sans-serif;
              }
              .legal-article h2 {
                margin-top: 2.75rem;
                margin-bottom: 0.75rem;
                font-size: 3rem;
                line-height: 1.0;
                text-transform: uppercase;
                font-weight: 900;
                letter-spacing: -0.03em;
                color: #121830;
              }
              @media (min-width: 768px) {
                .legal-article h2 { font-size: 4.5rem; }
              }
              .legal-article h3 {
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                line-height: 1.2;
                text-transform: uppercase;
                font-weight: 900;
                letter-spacing: 0.02em;
                color: #121830;
              }
              @media (min-width: 768px) {
                .legal-article h3 { font-size: 1.75rem; }
              }
              .legal-article p {
                color: #003D7A;
                line-height: 1.85;
                margin: 0.85rem 0 0.85rem 0;
              }
              .legal-article ul {
                margin: 0.85rem 0 1rem 0;
                padding-left: 1.5rem;
                list-style: disc;
              }
              .legal-article ul li {
                margin: 0.4rem 0;
              }
              .legal-article hr {
                margin: 2rem 0;
                border-color: #E5E7EB;
              }
            `}</style>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


function BackgroundDots() {
  return (
    <div className="absolute inset-0 opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #121830 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}


