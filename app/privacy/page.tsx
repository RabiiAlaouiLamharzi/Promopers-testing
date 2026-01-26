"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />

        <section className="py-20 bg-white relative overflow-hidden">
          <BackgroundDots />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
            <article className="legal-article max-w-none">
              <h2 id="privacy">{t("privacy.privacyPolicy")}</h2>

              <h3 id="controller">{t("privacy.controller")}</h3>
              <p>{t("privacy.controllerText")}</p>
              <p><strong>{t("privacy.companyName")}</strong><br />{t("privacy.companyAddress")}<br />{t("privacy.companyCity")}</p>
              <p>
                {t("privacy.email")} <a href="mailto:purpura@promopers.com">purpura@promopers.com</a><br />
                {t("privacy.website")} <a href="https://www.promopers.com/privacy" target="_blank" rel="noopener noreferrer">https://www.promopers.com/privacy</a>
              </p>

              <h2 id="general">{t("privacy.general")}</h2>
              <p>{t("privacy.generalText1")}</p>
              <p>{t("privacy.generalText2")}</p>
              <p>{t("privacy.generalText3")}</p>
              <p>{t("privacy.generalText4")}</p>
              <hr />

              <h2 id="processing">{t("privacy.processing")}</h2>
              <p>{t("privacy.processingText1")}</p>
              <p>{t("privacy.processingText2")}</p>
              <ul>
                <li>{t("privacy.processingLitA")}</li>
                <li>{t("privacy.processingLitB")}</li>
                <li>{t("privacy.processingLitC")}</li>
                <li>{t("privacy.processingLitD")}</li>
                <li>{t("privacy.processingLitF")}</li>
              </ul>
              <p>{t("privacy.processingText3")}</p>
              <hr />

              <h2 id="cookies">{t("privacy.cookies")}</h2>
              <p>{t("privacy.cookiesText1")}</p>
              <p>{t("privacy.cookiesText2")}</p>
              <hr />

              <h2 id="ssl">{t("privacy.ssl")}</h2>
              <p>{t("privacy.sslText1")}</p>
              <p>{t("privacy.sslText2")}</p>
              <hr />

              <h2 id="open-networks">{t("privacy.openNetworks")}</h2>
              <p>{t("privacy.openNetworksText1")}</p>
              <p>{t("privacy.openNetworksText2")}</p>
              <p>{t("privacy.openNetworksText3")}</p>
              <p>{t("privacy.openNetworksText4")}</p>
              <hr />

              <h2 id="logs">{t("privacy.logs")}</h2>
              <p>{t("privacy.logsText1")}</p>
              <ul>
                <li>{t("privacy.browserType")}</li>
                <li>{t("privacy.operatingSystem")}</li>
                <li>{t("privacy.referrerUrl")}</li>
                <li>{t("privacy.hostName")}</li>
                <li>{t("privacy.serverRequest")}</li>
              </ul>
              <p>{t("privacy.logsText2")}</p>
              <hr />

              <h2 id="third-parties">{t("privacy.thirdParties")}</h2>
              <p>{t("privacy.thirdPartiesText1")}</p>
              <p>{t("privacy.thirdPartiesText2")}</p>
              <p>{t("privacy.thirdPartiesText3")}</p>
              <p>{t("privacy.thirdPartiesText4")} <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{t("privacy.thirdPartiesText4")}</a>.</p>
              <hr />

              <h2 id="contact-form">{t("privacy.contactForm")}</h2>
              <p>{t("privacy.contactFormText")}</p>
              <hr />

              <h2 id="newsletter">{t("privacy.newsletter")}</h2>
              <p>{t("privacy.newsletterText1")}</p>
              <p>{t("privacy.newsletterText2")}</p>
              <hr />

              <h2 id="comments">{t("privacy.comments")}</h2>
              <p>{t("privacy.commentsText")}</p>
              <h3>{t("privacy.commentsIp")}</h3>
              <p>{t("privacy.commentsIpText")}</p>
              <h3>{t("privacy.commentsSubscribe")}</h3>
              <p>{t("privacy.commentsSubscribeText")}</p>
              <hr />

              <h2 id="rights">{t("privacy.rights")}</h2>
              <h3>{t("privacy.rightsConfirmation")}</h3>
              <p>{t("privacy.rightsConfirmationText")}</p>
              <h3>{t("privacy.rightsInfo")}</h3>
              <p>{t("privacy.rightsInfoText1")}</p>
              <ul>
                <li>{t("privacy.rightsInfoItem1")}</li>
                <li>{t("privacy.rightsInfoItem2")}</li>
                <li>{t("privacy.rightsInfoItem3")}</li>
                <li>{t("privacy.rightsInfoItem4")}</li>
                <li>{t("privacy.rightsInfoItem5")}</li>
                <li>{t("privacy.rightsInfoItem6")}</li>
                <li>{t("privacy.rightsInfoItem7")}</li>
              </ul>
              <p>{t("privacy.rightsInfoText2")}</p>
              <p>{t("privacy.rightsInfoText3")}</p>
              <h3>{t("privacy.rightsRectification")}</h3>
              <p>{t("privacy.rightsRectificationText1")}</p>
              <p>{t("privacy.rightsRectificationText2")}</p>
              <h3>{t("privacy.rightsErasure")}</h3>
              <p>{t("privacy.rightsErasureText1")}</p>
              <ul>
                <li>{t("privacy.rightsErasureItem1")}</li>
                <li>{t("privacy.rightsErasureItem2")}</li>
                <li>{t("privacy.rightsErasureItem3")}</li>
                <li>{t("privacy.rightsErasureItem4")}</li>
                <li>{t("privacy.rightsErasureItem5")}</li>
                <li>{t("privacy.rightsErasureItem6")}</li>
              </ul>
              <p>{t("privacy.rightsErasureText2")}</p>
              <h3>{t("privacy.rightsRestriction")}</h3>
              <p>{t("privacy.rightsRestrictionText1")}</p>
              <ul>
                <li>{t("privacy.rightsRestrictionItem1")}</li>
                <li>{t("privacy.rightsRestrictionItem2")}</li>
                <li>{t("privacy.rightsRestrictionItem3")}</li>
                <li>{t("privacy.rightsRestrictionItem4")}</li>
              </ul>
              <p>{t("privacy.rightsRestrictionText2")}</p>
              <h3>{t("privacy.rightsPortability")}</h3>
              <p>{t("privacy.rightsPortabilityText1")}</p>
              <p>{t("privacy.rightsPortabilityText2")}</p>
              <p>{t("privacy.rightsPortabilityText3")}</p>
              <h3>{t("privacy.rightsObject")}</h3>
              <p>{t("privacy.rightsObjectText1")}</p>
              <p>{t("privacy.rightsObjectText2")}</p>
              <p>{t("privacy.rightsObjectText3")}</p>
              <h3>{t("privacy.rightsRevoke")}</h3>
              <p>{t("privacy.rightsRevokeText1")}</p>
              <p>{t("privacy.rightsRevokeText2")}</p>
              <hr />

              <h2 id="ads-objection">{t("privacy.adsObjection")}</h2>
              <p>{t("privacy.adsObjectionText")}</p>
              <hr />

              <h2 id="paid-services">{t("privacy.paidServices")}</h2>
              <p>{t("privacy.paidServicesText")}</p>
              <hr />

              <h2 id="adwords">{t("privacy.adwords")}</h2>
              <p>{t("privacy.adwordsText1")}</p>
              <p>{t("privacy.adwordsText2")}</p>
              <p>{t("privacy.adwordsText3")}</p>
              <hr />

              <h2 id="recaptcha">{t("privacy.recaptcha")}</h2>
              <p>{t("privacy.recaptchaText1")}</p>
              <p>{t("privacy.recaptchaText2")} <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy?hl=de</a></p>
              <hr />

              <h2 id="google-ads">{t("privacy.googleAds")}</h2>
              <p>{t("privacy.googleAdsText1")}</p>
              <p>{t("privacy.googleAdsText2")}</p>
              <p>{t("privacy.googleAdsText3")}</p>
              <ul>
                <li>{t("privacy.googleAdsItem1")}</li>
                <li>{t("privacy.googleAdsItem2")}</li>
                <li>{t("privacy.googleAdsItem3")}</li>
                <li>{t("privacy.googleAdsItem4")}</li>
              </ul>
              <p>{t("privacy.googleAdsText4")}</p>
              <hr />

              <h2 id="gtm">{t("privacy.gtm")}</h2>
              <p>{t("privacy.gtmText")} <a href="https://www.google.com/intl/de/tagmanager/use-policy.html" target="_blank" rel="noopener noreferrer">https://www.google.com/intl/de/tagmanager/use-policy.html</a>.</p>
              <hr />

              <h2 id="mailchimp">{t("privacy.mailchimp")}</h2>
              <p>{t("privacy.mailchimpText1")}</p>
              <p>{t("privacy.mailchimpText2")}</p>
              <hr />

              <h2 id="conferencing">{t("privacy.conferencing")}</h2>
              <p>{t("privacy.conferencingText1")}</p>
              <p>{t("privacy.conferencingText2")}</p>
              <p>{t("privacy.conferencingText3")}</p>
              <hr />

              <h2 id="youtube">{t("privacy.youtube")}</h2>
              <p>{t("privacy.youtubeText1")}</p>
              <p>{t("privacy.youtubeText2")}</p>
              <hr />

              <h2 id="agency">{t("privacy.agency")}</h2>
              <p>{t("privacy.agencyText1")}</p>
              <p>{t("privacy.agencyText2")}</p>
              <p>{t("privacy.agencyText3")}</p>
              <hr />

              <h2 id="copyrights">{t("privacy.copyrights")}</h2>
              <p>{t("privacy.copyrightsText1")}</p>
              <p>{t("privacy.copyrightsText2")}</p>
              <hr />

              <h2 id="disclaimer">{t("privacy.disclaimer")}</h2>
              <p>{t("privacy.disclaimerText1")}</p>
              <p>{t("privacy.disclaimerText2")}</p>
              <p>{t("privacy.disclaimerText3")}</p>
              <hr />

              <h2 id="changes">{t("privacy.changes")}</h2>
              <p>{t("privacy.changesText")}</p>

              <h2 id="questions">{t("privacy.questions")}</h2>
              <p>{t("privacy.questionsText")}</p>
              <p>{t("privacy.date")}</p>
            </article>
            <style jsx>{`
              .legal-article {
                font-family: var(--font-roboto-condensed);
              }
              .legal-article h2:first-of-type {
                padding-left: 20%;
                padding-right: 20%;
              }
              .legal-article h2 {
                margin-top: 2.75rem;
                margin-bottom: 0.75rem;
                font-size: 2.25rem;
                line-height: 1.1;
                text-transform: uppercase;
                font-weight: 900;
                letter-spacing: -0.01em;
                color: #002855;
              }
              @media (min-width: 768px) {
                .legal-article h2 { font-size: 3rem; }
              }
              .legal-article h3 {
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                line-height: 1.2;
                text-transform: uppercase;
                font-weight: 900;
                letter-spacing: 0.02em;
                color: #002855;
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

function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  useEffect(() => setIsVisible(true), [])
  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFC72C]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>
      <div className="relative z-10 luxury-container text-center px-6">
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-[#FFC72C] bg-white/5 mt-16">
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("privacy.badge")}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">{t("privacy.privacyPolicy")}</span>
          </h1>
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
  )
}

function BackgroundDots() {
  return (
    <div className="absolute inset-0 opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #002855 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}

const quickLinks = [
  { href: "#controller", label: "Controller" },
  { href: "#general", label: "General note" },
  { href: "#processing", label: "Processing" },
  { href: "#cookies", label: "Cookies" },
  { href: "#ssl", label: "SSL/TLS" },
  { href: "#open-networks", label: "Open networks" },
  { href: "#logs", label: "Server logs" },
  { href: "#third-parties", label: "Third‑party services" },
  { href: "#rights", label: "Your rights" },
  { href: "#changes", label: "Changes" },
  { href: "#questions", label: "Questions" },
] as const
