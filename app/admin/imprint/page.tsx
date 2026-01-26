"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { EditProvider, useEdit } from "@/contexts/edit-context"
import { TextOverridesProvider, useTextOverrides } from "@/contexts/text-overrides-context"
import { EditableText } from "@/components/editable-text"

function AdminImprintContent() {
  const { toast } = useToast()
  const { setEditMode } = useEdit()
  const { saveOverrides, isSaving } = useTextOverrides()
  const { reloadOverrides, t } = useLanguage()
  
  // Always enable edit mode in admin
  useEffect(() => {
    setEditMode(true)
  }, [setEditMode])

  const handleSave = async () => {
    try {
      console.log('[AdminImprint] Saving changes...')
      await saveOverrides()
      await reloadOverrides()
      console.log('[AdminImprint] ✅ All changes saved and reloaded!')
      toast({
        title: "Saved!",
        description: "Changes saved successfully to database",
      })
    } catch (error) {
      console.error('[AdminImprint] ❌ Save failed:', error)
      toast({
        title: "Error!",
        description: "Failed to save changes",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .admin-edit-mode a,
        .admin-edit-mode button {
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        .admin-edit-mode .editable-text {
          cursor: default !important;
          position: relative;
          z-index: 1;
        }
        
        .admin-edit-mode .admin-save-button {
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        .edit-icon {
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          pointer-events: auto !important;
          color: #666 !important;
          transition: color 0.2s ease !important;
          opacity: 1 !important;
          visibility: visible !important;
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .edit-icon:hover {
          color: #002855 !important;
        }
        
        .edit-icon svg {
          width: 20px !important;
          height: 20px !important;
          stroke: currentColor !important;
          fill: none !important;
        }
      `}} />
      <div className="min-h-screen bg-white admin-edit-mode">
        <Navigation />
      
        {/* Floating Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="admin-save-button fixed bottom-8 right-8 px-8 py-4 bg-[#FFC72C] text-[#002855] rounded-full font-bold hover:bg-[#E6B526] transition-all shadow-2xl flex items-center gap-3 z-50 hover:scale-105 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        <main>
          <HeroSection />
          <ImprintContentSection />
        </main>

        <Footer />
      </div>
    </>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [badge, setBadge] = useState(t("imprint.badge"))
  const [title, setTitle] = useState(t("imprint.title"))

  useEffect(() => {
    setIsVisible(true)
    setBadge(t("imprint.badge"))
    setTitle(t("imprint.title"))
  }, [t])

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
            <EditableText
              value={badge}
              onChange={setBadge}
              translationKey="imprint.badge"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]"
            />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <EditableText
              value={title}
              onChange={setTitle}
              translationKey="imprint.title"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C]"
            />
          </h1>
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
  )
}

function ImprintContentSection() {
  const { t } = useLanguage()
  const { editMode } = useEdit()
  
  // All editable text states
  const [contact, setContact] = useState(t("imprint.contact"))
  const [companyName, setCompanyName] = useState(t("imprint.companyName"))
  const [companyAddress, setCompanyAddress] = useState(t("imprint.companyAddress"))
  const [companyCity, setCompanyCity] = useState(t("imprint.companyCity"))
  const [country, setCountry] = useState(t("imprint.country"))
  const [email, setEmail] = useState(t("imprint.email"))
  const [representatives, setRepresentatives] = useState(t("imprint.representatives"))
  const [representativesText, setRepresentativesText] = useState(t("imprint.representativesText"))
  const [representativesText2, setRepresentativesText2] = useState(t("imprint.representativesText2"))
  const [register, setRegister] = useState(t("imprint.register"))
  const [registerName, setRegisterName] = useState(t("imprint.registerName"))
  const [registerNumber, setRegisterNumber] = useState(t("imprint.registerNumber"))
  const [vat, setVat] = useState(t("imprint.vat"))
  const [vatNumber, setVatNumber] = useState(t("imprint.vatNumber"))
  const [disclaimer, setDisclaimer] = useState(t("imprint.disclaimer"))
  const [disclaimerText1, setDisclaimerText1] = useState(t("imprint.disclaimerText1"))
  const [disclaimerText2, setDisclaimerText2] = useState(t("imprint.disclaimerText2"))
  const [disclaimerText3, setDisclaimerText3] = useState(t("imprint.disclaimerText3"))
  const [links, setLinks] = useState(t("imprint.links"))
  const [linksText, setLinksText] = useState(t("imprint.linksText"))
  const [copyrights, setCopyrights] = useState(t("imprint.copyrights"))
  const [copyrightsText, setCopyrightsText] = useState(t("imprint.copyrightsText"))

  useEffect(() => {
    setContact(t("imprint.contact"))
    setCompanyName(t("imprint.companyName"))
    setCompanyAddress(t("imprint.companyAddress"))
    setCompanyCity(t("imprint.companyCity"))
    setCountry(t("imprint.country"))
    setEmail(t("imprint.email"))
    setRepresentatives(t("imprint.representatives"))
    setRepresentativesText(t("imprint.representativesText"))
    setRepresentativesText2(t("imprint.representativesText2"))
    setRegister(t("imprint.register"))
    setRegisterName(t("imprint.registerName"))
    setRegisterNumber(t("imprint.registerNumber"))
    setVat(t("imprint.vat"))
    setVatNumber(t("imprint.vatNumber"))
    setDisclaimer(t("imprint.disclaimer"))
    setDisclaimerText1(t("imprint.disclaimerText1"))
    setDisclaimerText2(t("imprint.disclaimerText2"))
    setDisclaimerText3(t("imprint.disclaimerText3"))
    setLinks(t("imprint.links"))
    setLinksText(t("imprint.linksText"))
    setCopyrights(t("imprint.copyrights"))
    setCopyrightsText(t("imprint.copyrightsText"))
  }, [t])

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #002855 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        <article className="legal-article max-w-none">
          <h2 id="contact">
            <EditableText
              value={contact}
              onChange={setContact}
              translationKey="imprint.contact"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <strong>
              <EditableText
                value={companyName}
                onChange={setCompanyName}
                translationKey="imprint.companyName"
                editMode={editMode}
                as="span"
              />
            </strong><br />
            <EditableText
              value={companyAddress}
              onChange={setCompanyAddress}
              translationKey="imprint.companyAddress"
              editMode={editMode}
              as="span"
            /><br />
            <EditableText
              value={companyCity}
              onChange={setCompanyCity}
              translationKey="imprint.companyCity"
              editMode={editMode}
              as="span"
            /><br />
            <EditableText
              value={country}
              onChange={setCountry}
              translationKey="imprint.country"
              editMode={editMode}
              as="span"
            />
          </p>
          <p>
            <EditableText
              value={email}
              onChange={setEmail}
              translationKey="imprint.email"
              editMode={editMode}
              as="span"
            /> <a href="mailto:info@promopers.com">info@promopers.com</a>
          </p>
          <hr />

          <h2 id="representatives">
            <EditableText
              value={representatives}
              onChange={setRepresentatives}
              translationKey="imprint.representatives"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={representativesText}
              onChange={setRepresentativesText}
              translationKey="imprint.representativesText"
              editMode={editMode}
              as="span"
              multiline
            /><br />
            <EditableText
              value={representativesText2}
              onChange={setRepresentativesText2}
              translationKey="imprint.representativesText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="register">
            <EditableText
              value={register}
              onChange={setRegister}
              translationKey="imprint.register"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={registerName}
              onChange={setRegisterName}
              translationKey="imprint.registerName"
              editMode={editMode}
              as="span"
            /><br />
            <EditableText
              value={registerNumber}
              onChange={setRegisterNumber}
              translationKey="imprint.registerNumber"
              editMode={editMode}
              as="span"
            />
          </p>
          <hr />

          <h2 id="vat">
            <EditableText
              value={vat}
              onChange={setVat}
              translationKey="imprint.vat"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={vatNumber}
              onChange={setVatNumber}
              translationKey="imprint.vatNumber"
              editMode={editMode}
              as="span"
            />
          </p>
          <hr />

          <h2 id="disclaimer">
            <EditableText
              value={disclaimer}
              onChange={setDisclaimer}
              translationKey="imprint.disclaimer"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={disclaimerText1}
              onChange={setDisclaimerText1}
              translationKey="imprint.disclaimerText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={disclaimerText2}
              onChange={setDisclaimerText2}
              translationKey="imprint.disclaimerText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={disclaimerText3}
              onChange={setDisclaimerText3}
              translationKey="imprint.disclaimerText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="links">
            <EditableText
              value={links}
              onChange={setLinks}
              translationKey="imprint.links"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={linksText}
              onChange={setLinksText}
              translationKey="imprint.linksText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="copyrights">
            <EditableText
              value={copyrights}
              onChange={setCopyrights}
              translationKey="imprint.copyrights"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={copyrightsText}
              onChange={setCopyrightsText}
              translationKey="imprint.copyrightsText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
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
  )
}

export default function AdminImprintPage() {
  return (
    <TextOverridesProvider>
      <EditProvider>
        <AdminImprintContent />
      </EditProvider>
    </TextOverridesProvider>
  )
}

