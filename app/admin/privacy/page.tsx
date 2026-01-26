"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { EditProvider, useEdit } from "@/contexts/edit-context"
import { TextOverridesProvider, useTextOverrides } from "@/contexts/text-overrides-context"
import { EditableText } from "@/components/editable-text"

function AdminPrivacyContent() {
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
      console.log('[AdminPrivacy] Saving changes...')
      await saveOverrides()
      await reloadOverrides()
      console.log('[AdminPrivacy] ✅ All changes saved and reloaded!')
      toast({
        title: "Saved!",
        description: "Changes saved successfully to database",
      })
    } catch (error) {
      console.error('[AdminPrivacy] ❌ Save failed:', error)
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
          <PrivacyContentSection />
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
  const [badge, setBadge] = useState(t("privacy.badge"))
  const [privacyPolicy, setPrivacyPolicy] = useState(t("privacy.privacyPolicy"))

  useEffect(() => {
    setIsVisible(true)
    setBadge(t("privacy.badge"))
    setPrivacyPolicy(t("privacy.privacyPolicy"))
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
              translationKey="privacy.badge"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]"
            />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <EditableText
              value={privacyPolicy}
              onChange={setPrivacyPolicy}
              translationKey="privacy.privacyPolicy"
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

function PrivacyContentSection() {
  const { t } = useLanguage()
  const { editMode } = useEdit()
  
  // All editable text states - organized by section
  const [privacyPolicy, setPrivacyPolicy] = useState(t("privacy.privacyPolicy"))
  const [controller, setController] = useState(t("privacy.controller"))
  const [controllerText, setControllerText] = useState(t("privacy.controllerText"))
  const [companyName, setCompanyName] = useState(t("privacy.companyName"))
  const [companyAddress, setCompanyAddress] = useState(t("privacy.companyAddress"))
  const [companyCity, setCompanyCity] = useState(t("privacy.companyCity"))
  const [email, setEmail] = useState(t("privacy.email"))
  const [website, setWebsite] = useState(t("privacy.website"))
  const [general, setGeneral] = useState(t("privacy.general"))
  const [generalText1, setGeneralText1] = useState(t("privacy.generalText1"))
  const [generalText2, setGeneralText2] = useState(t("privacy.generalText2"))
  const [generalText3, setGeneralText3] = useState(t("privacy.generalText3"))
  const [generalText4, setGeneralText4] = useState(t("privacy.generalText4"))
  const [processing, setProcessing] = useState(t("privacy.processing"))
  const [processingText1, setProcessingText1] = useState(t("privacy.processingText1"))
  const [processingText2, setProcessingText2] = useState(t("privacy.processingText2"))
  const [processingLitA, setProcessingLitA] = useState(t("privacy.processingLitA"))
  const [processingLitB, setProcessingLitB] = useState(t("privacy.processingLitB"))
  const [processingLitC, setProcessingLitC] = useState(t("privacy.processingLitC"))
  const [processingLitD, setProcessingLitD] = useState(t("privacy.processingLitD"))
  const [processingLitF, setProcessingLitF] = useState(t("privacy.processingLitF"))
  const [processingText3, setProcessingText3] = useState(t("privacy.processingText3"))
  const [cookies, setCookies] = useState(t("privacy.cookies"))
  const [cookiesText1, setCookiesText1] = useState(t("privacy.cookiesText1"))
  const [cookiesText2, setCookiesText2] = useState(t("privacy.cookiesText2"))
  const [ssl, setSsl] = useState(t("privacy.ssl"))
  const [sslText1, setSslText1] = useState(t("privacy.sslText1"))
  const [sslText2, setSslText2] = useState(t("privacy.sslText2"))
  const [openNetworks, setOpenNetworks] = useState(t("privacy.openNetworks"))
  const [openNetworksText1, setOpenNetworksText1] = useState(t("privacy.openNetworksText1"))
  const [openNetworksText2, setOpenNetworksText2] = useState(t("privacy.openNetworksText2"))
  const [openNetworksText3, setOpenNetworksText3] = useState(t("privacy.openNetworksText3"))
  const [openNetworksText4, setOpenNetworksText4] = useState(t("privacy.openNetworksText4"))
  const [logs, setLogs] = useState(t("privacy.logs"))
  const [logsText1, setLogsText1] = useState(t("privacy.logsText1"))
  const [browserType, setBrowserType] = useState(t("privacy.browserType"))
  const [operatingSystem, setOperatingSystem] = useState(t("privacy.operatingSystem"))
  const [referrerUrl, setReferrerUrl] = useState(t("privacy.referrerUrl"))
  const [hostName, setHostName] = useState(t("privacy.hostName"))
  const [serverRequest, setServerRequest] = useState(t("privacy.serverRequest"))
  const [logsText2, setLogsText2] = useState(t("privacy.logsText2"))
  const [thirdParties, setThirdParties] = useState(t("privacy.thirdParties"))
  const [thirdPartiesText1, setThirdPartiesText1] = useState(t("privacy.thirdPartiesText1"))
  const [thirdPartiesText2, setThirdPartiesText2] = useState(t("privacy.thirdPartiesText2"))
  const [thirdPartiesText3, setThirdPartiesText3] = useState(t("privacy.thirdPartiesText3"))
  const [thirdPartiesText4, setThirdPartiesText4] = useState(t("privacy.thirdPartiesText4"))
  const [contactForm, setContactForm] = useState(t("privacy.contactForm"))
  const [contactFormText, setContactFormText] = useState(t("privacy.contactFormText"))
  const [newsletter, setNewsletter] = useState(t("privacy.newsletter"))
  const [newsletterText1, setNewsletterText1] = useState(t("privacy.newsletterText1"))
  const [newsletterText2, setNewsletterText2] = useState(t("privacy.newsletterText2"))
  const [comments, setComments] = useState(t("privacy.comments"))
  const [commentsText, setCommentsText] = useState(t("privacy.commentsText"))
  const [commentsIp, setCommentsIp] = useState(t("privacy.commentsIp"))
  const [commentsIpText, setCommentsIpText] = useState(t("privacy.commentsIpText"))
  const [commentsSubscribe, setCommentsSubscribe] = useState(t("privacy.commentsSubscribe"))
  const [commentsSubscribeText, setCommentsSubscribeText] = useState(t("privacy.commentsSubscribeText"))
  const [rights, setRights] = useState(t("privacy.rights"))
  const [rightsConfirmation, setRightsConfirmation] = useState(t("privacy.rightsConfirmation"))
  const [rightsConfirmationText, setRightsConfirmationText] = useState(t("privacy.rightsConfirmationText"))
  const [rightsInfo, setRightsInfo] = useState(t("privacy.rightsInfo"))
  const [rightsInfoText1, setRightsInfoText1] = useState(t("privacy.rightsInfoText1"))
  const [rightsInfoItem1, setRightsInfoItem1] = useState(t("privacy.rightsInfoItem1"))
  const [rightsInfoItem2, setRightsInfoItem2] = useState(t("privacy.rightsInfoItem2"))
  const [rightsInfoItem3, setRightsInfoItem3] = useState(t("privacy.rightsInfoItem3"))
  const [rightsInfoItem4, setRightsInfoItem4] = useState(t("privacy.rightsInfoItem4"))
  const [rightsInfoItem5, setRightsInfoItem5] = useState(t("privacy.rightsInfoItem5"))
  const [rightsInfoItem6, setRightsInfoItem6] = useState(t("privacy.rightsInfoItem6"))
  const [rightsInfoItem7, setRightsInfoItem7] = useState(t("privacy.rightsInfoItem7"))
  const [rightsInfoText2, setRightsInfoText2] = useState(t("privacy.rightsInfoText2"))
  const [rightsInfoText3, setRightsInfoText3] = useState(t("privacy.rightsInfoText3"))
  const [rightsRectification, setRightsRectification] = useState(t("privacy.rightsRectification"))
  const [rightsRectificationText1, setRightsRectificationText1] = useState(t("privacy.rightsRectificationText1"))
  const [rightsRectificationText2, setRightsRectificationText2] = useState(t("privacy.rightsRectificationText2"))
  const [rightsErasure, setRightsErasure] = useState(t("privacy.rightsErasure"))
  const [rightsErasureText1, setRightsErasureText1] = useState(t("privacy.rightsErasureText1"))
  const [rightsErasureItem1, setRightsErasureItem1] = useState(t("privacy.rightsErasureItem1"))
  const [rightsErasureItem2, setRightsErasureItem2] = useState(t("privacy.rightsErasureItem2"))
  const [rightsErasureItem3, setRightsErasureItem3] = useState(t("privacy.rightsErasureItem3"))
  const [rightsErasureItem4, setRightsErasureItem4] = useState(t("privacy.rightsErasureItem4"))
  const [rightsErasureItem5, setRightsErasureItem5] = useState(t("privacy.rightsErasureItem5"))
  const [rightsErasureItem6, setRightsErasureItem6] = useState(t("privacy.rightsErasureItem6"))
  const [rightsErasureText2, setRightsErasureText2] = useState(t("privacy.rightsErasureText2"))
  const [rightsRestriction, setRightsRestriction] = useState(t("privacy.rightsRestriction"))
  const [rightsRestrictionText1, setRightsRestrictionText1] = useState(t("privacy.rightsRestrictionText1"))
  const [rightsRestrictionItem1, setRightsRestrictionItem1] = useState(t("privacy.rightsRestrictionItem1"))
  const [rightsRestrictionItem2, setRightsRestrictionItem2] = useState(t("privacy.rightsRestrictionItem2"))
  const [rightsRestrictionItem3, setRightsRestrictionItem3] = useState(t("privacy.rightsRestrictionItem3"))
  const [rightsRestrictionItem4, setRightsRestrictionItem4] = useState(t("privacy.rightsRestrictionItem4"))
  const [rightsRestrictionText2, setRightsRestrictionText2] = useState(t("privacy.rightsRestrictionText2"))
  const [rightsPortability, setRightsPortability] = useState(t("privacy.rightsPortability"))
  const [rightsPortabilityText1, setRightsPortabilityText1] = useState(t("privacy.rightsPortabilityText1"))
  const [rightsPortabilityText2, setRightsPortabilityText2] = useState(t("privacy.rightsPortabilityText2"))
  const [rightsPortabilityText3, setRightsPortabilityText3] = useState(t("privacy.rightsPortabilityText3"))
  const [rightsObject, setRightsObject] = useState(t("privacy.rightsObject"))
  const [rightsObjectText1, setRightsObjectText1] = useState(t("privacy.rightsObjectText1"))
  const [rightsObjectText2, setRightsObjectText2] = useState(t("privacy.rightsObjectText2"))
  const [rightsObjectText3, setRightsObjectText3] = useState(t("privacy.rightsObjectText3"))
  const [rightsRevoke, setRightsRevoke] = useState(t("privacy.rightsRevoke"))
  const [rightsRevokeText1, setRightsRevokeText1] = useState(t("privacy.rightsRevokeText1"))
  const [rightsRevokeText2, setRightsRevokeText2] = useState(t("privacy.rightsRevokeText2"))
  const [adsObjection, setAdsObjection] = useState(t("privacy.adsObjection"))
  const [adsObjectionText, setAdsObjectionText] = useState(t("privacy.adsObjectionText"))
  const [paidServices, setPaidServices] = useState(t("privacy.paidServices"))
  const [paidServicesText, setPaidServicesText] = useState(t("privacy.paidServicesText"))
  const [adwords, setAdwords] = useState(t("privacy.adwords"))
  const [adwordsText1, setAdwordsText1] = useState(t("privacy.adwordsText1"))
  const [adwordsText2, setAdwordsText2] = useState(t("privacy.adwordsText2"))
  const [adwordsText3, setAdwordsText3] = useState(t("privacy.adwordsText3"))
  const [recaptcha, setRecaptcha] = useState(t("privacy.recaptcha"))
  const [recaptchaText1, setRecaptchaText1] = useState(t("privacy.recaptchaText1"))
  const [recaptchaText2, setRecaptchaText2] = useState(t("privacy.recaptchaText2"))
  const [googleAds, setGoogleAds] = useState(t("privacy.googleAds"))
  const [googleAdsText1, setGoogleAdsText1] = useState(t("privacy.googleAdsText1"))
  const [googleAdsText2, setGoogleAdsText2] = useState(t("privacy.googleAdsText2"))
  const [googleAdsText3, setGoogleAdsText3] = useState(t("privacy.googleAdsText3"))
  const [googleAdsItem1, setGoogleAdsItem1] = useState(t("privacy.googleAdsItem1"))
  const [googleAdsItem2, setGoogleAdsItem2] = useState(t("privacy.googleAdsItem2"))
  const [googleAdsItem3, setGoogleAdsItem3] = useState(t("privacy.googleAdsItem3"))
  const [googleAdsItem4, setGoogleAdsItem4] = useState(t("privacy.googleAdsItem4"))
  const [googleAdsText4, setGoogleAdsText4] = useState(t("privacy.googleAdsText4"))
  const [gtm, setGtm] = useState(t("privacy.gtm"))
  const [gtmText, setGtmText] = useState(t("privacy.gtmText"))
  const [mailchimp, setMailchimp] = useState(t("privacy.mailchimp"))
  const [mailchimpText1, setMailchimpText1] = useState(t("privacy.mailchimpText1"))
  const [mailchimpText2, setMailchimpText2] = useState(t("privacy.mailchimpText2"))
  const [conferencing, setConferencing] = useState(t("privacy.conferencing"))
  const [conferencingText1, setConferencingText1] = useState(t("privacy.conferencingText1"))
  const [conferencingText2, setConferencingText2] = useState(t("privacy.conferencingText2"))
  const [conferencingText3, setConferencingText3] = useState(t("privacy.conferencingText3"))
  const [youtube, setYoutube] = useState(t("privacy.youtube"))
  const [youtubeText1, setYoutubeText1] = useState(t("privacy.youtubeText1"))
  const [youtubeText2, setYoutubeText2] = useState(t("privacy.youtubeText2"))
  const [agency, setAgency] = useState(t("privacy.agency"))
  const [agencyText1, setAgencyText1] = useState(t("privacy.agencyText1"))
  const [agencyText2, setAgencyText2] = useState(t("privacy.agencyText2"))
  const [agencyText3, setAgencyText3] = useState(t("privacy.agencyText3"))
  const [copyrights, setCopyrights] = useState(t("privacy.copyrights"))
  const [copyrightsText1, setCopyrightsText1] = useState(t("privacy.copyrightsText1"))
  const [copyrightsText2, setCopyrightsText2] = useState(t("privacy.copyrightsText2"))
  const [disclaimer, setDisclaimer] = useState(t("privacy.disclaimer"))
  const [disclaimerText1, setDisclaimerText1] = useState(t("privacy.disclaimerText1"))
  const [disclaimerText2, setDisclaimerText2] = useState(t("privacy.disclaimerText2"))
  const [disclaimerText3, setDisclaimerText3] = useState(t("privacy.disclaimerText3"))
  const [changes, setChanges] = useState(t("privacy.changes"))
  const [changesText, setChangesText] = useState(t("privacy.changesText"))
  const [questions, setQuestions] = useState(t("privacy.questions"))
  const [questionsText, setQuestionsText] = useState(t("privacy.questionsText"))
  const [date, setDate] = useState(t("privacy.date"))

  // Update all states when translations change
  useEffect(() => {
    setPrivacyPolicy(t("privacy.privacyPolicy"))
    setController(t("privacy.controller"))
    setControllerText(t("privacy.controllerText"))
    setCompanyName(t("privacy.companyName"))
    setCompanyAddress(t("privacy.companyAddress"))
    setCompanyCity(t("privacy.companyCity"))
    setEmail(t("privacy.email"))
    setWebsite(t("privacy.website"))
    setGeneral(t("privacy.general"))
    setGeneralText1(t("privacy.generalText1"))
    setGeneralText2(t("privacy.generalText2"))
    setGeneralText3(t("privacy.generalText3"))
    setGeneralText4(t("privacy.generalText4"))
    setProcessing(t("privacy.processing"))
    setProcessingText1(t("privacy.processingText1"))
    setProcessingText2(t("privacy.processingText2"))
    setProcessingLitA(t("privacy.processingLitA"))
    setProcessingLitB(t("privacy.processingLitB"))
    setProcessingLitC(t("privacy.processingLitC"))
    setProcessingLitD(t("privacy.processingLitD"))
    setProcessingLitF(t("privacy.processingLitF"))
    setProcessingText3(t("privacy.processingText3"))
    setCookies(t("privacy.cookies"))
    setCookiesText1(t("privacy.cookiesText1"))
    setCookiesText2(t("privacy.cookiesText2"))
    setSsl(t("privacy.ssl"))
    setSslText1(t("privacy.sslText1"))
    setSslText2(t("privacy.sslText2"))
    setOpenNetworks(t("privacy.openNetworks"))
    setOpenNetworksText1(t("privacy.openNetworksText1"))
    setOpenNetworksText2(t("privacy.openNetworksText2"))
    setOpenNetworksText3(t("privacy.openNetworksText3"))
    setOpenNetworksText4(t("privacy.openNetworksText4"))
    setLogs(t("privacy.logs"))
    setLogsText1(t("privacy.logsText1"))
    setBrowserType(t("privacy.browserType"))
    setOperatingSystem(t("privacy.operatingSystem"))
    setReferrerUrl(t("privacy.referrerUrl"))
    setHostName(t("privacy.hostName"))
    setServerRequest(t("privacy.serverRequest"))
    setLogsText2(t("privacy.logsText2"))
    setThirdParties(t("privacy.thirdParties"))
    setThirdPartiesText1(t("privacy.thirdPartiesText1"))
    setThirdPartiesText2(t("privacy.thirdPartiesText2"))
    setThirdPartiesText3(t("privacy.thirdPartiesText3"))
    setThirdPartiesText4(t("privacy.thirdPartiesText4"))
    setContactForm(t("privacy.contactForm"))
    setContactFormText(t("privacy.contactFormText"))
    setNewsletter(t("privacy.newsletter"))
    setNewsletterText1(t("privacy.newsletterText1"))
    setNewsletterText2(t("privacy.newsletterText2"))
    setComments(t("privacy.comments"))
    setCommentsText(t("privacy.commentsText"))
    setCommentsIp(t("privacy.commentsIp"))
    setCommentsIpText(t("privacy.commentsIpText"))
    setCommentsSubscribe(t("privacy.commentsSubscribe"))
    setCommentsSubscribeText(t("privacy.commentsSubscribeText"))
    setRights(t("privacy.rights"))
    setRightsConfirmation(t("privacy.rightsConfirmation"))
    setRightsConfirmationText(t("privacy.rightsConfirmationText"))
    setRightsInfo(t("privacy.rightsInfo"))
    setRightsInfoText1(t("privacy.rightsInfoText1"))
    setRightsInfoItem1(t("privacy.rightsInfoItem1"))
    setRightsInfoItem2(t("privacy.rightsInfoItem2"))
    setRightsInfoItem3(t("privacy.rightsInfoItem3"))
    setRightsInfoItem4(t("privacy.rightsInfoItem4"))
    setRightsInfoItem5(t("privacy.rightsInfoItem5"))
    setRightsInfoItem6(t("privacy.rightsInfoItem6"))
    setRightsInfoItem7(t("privacy.rightsInfoItem7"))
    setRightsInfoText2(t("privacy.rightsInfoText2"))
    setRightsInfoText3(t("privacy.rightsInfoText3"))
    setRightsRectification(t("privacy.rightsRectification"))
    setRightsRectificationText1(t("privacy.rightsRectificationText1"))
    setRightsRectificationText2(t("privacy.rightsRectificationText2"))
    setRightsErasure(t("privacy.rightsErasure"))
    setRightsErasureText1(t("privacy.rightsErasureText1"))
    setRightsErasureItem1(t("privacy.rightsErasureItem1"))
    setRightsErasureItem2(t("privacy.rightsErasureItem2"))
    setRightsErasureItem3(t("privacy.rightsErasureItem3"))
    setRightsErasureItem4(t("privacy.rightsErasureItem4"))
    setRightsErasureItem5(t("privacy.rightsErasureItem5"))
    setRightsErasureItem6(t("privacy.rightsErasureItem6"))
    setRightsErasureText2(t("privacy.rightsErasureText2"))
    setRightsRestriction(t("privacy.rightsRestriction"))
    setRightsRestrictionText1(t("privacy.rightsRestrictionText1"))
    setRightsRestrictionItem1(t("privacy.rightsRestrictionItem1"))
    setRightsRestrictionItem2(t("privacy.rightsRestrictionItem2"))
    setRightsRestrictionItem3(t("privacy.rightsRestrictionItem3"))
    setRightsRestrictionItem4(t("privacy.rightsRestrictionItem4"))
    setRightsRestrictionText2(t("privacy.rightsRestrictionText2"))
    setRightsPortability(t("privacy.rightsPortability"))
    setRightsPortabilityText1(t("privacy.rightsPortabilityText1"))
    setRightsPortabilityText2(t("privacy.rightsPortabilityText2"))
    setRightsPortabilityText3(t("privacy.rightsPortabilityText3"))
    setRightsObject(t("privacy.rightsObject"))
    setRightsObjectText1(t("privacy.rightsObjectText1"))
    setRightsObjectText2(t("privacy.rightsObjectText2"))
    setRightsObjectText3(t("privacy.rightsObjectText3"))
    setRightsRevoke(t("privacy.rightsRevoke"))
    setRightsRevokeText1(t("privacy.rightsRevokeText1"))
    setRightsRevokeText2(t("privacy.rightsRevokeText2"))
    setAdsObjection(t("privacy.adsObjection"))
    setAdsObjectionText(t("privacy.adsObjectionText"))
    setPaidServices(t("privacy.paidServices"))
    setPaidServicesText(t("privacy.paidServicesText"))
    setAdwords(t("privacy.adwords"))
    setAdwordsText1(t("privacy.adwordsText1"))
    setAdwordsText2(t("privacy.adwordsText2"))
    setAdwordsText3(t("privacy.adwordsText3"))
    setRecaptcha(t("privacy.recaptcha"))
    setRecaptchaText1(t("privacy.recaptchaText1"))
    setRecaptchaText2(t("privacy.recaptchaText2"))
    setGoogleAds(t("privacy.googleAds"))
    setGoogleAdsText1(t("privacy.googleAdsText1"))
    setGoogleAdsText2(t("privacy.googleAdsText2"))
    setGoogleAdsText3(t("privacy.googleAdsText3"))
    setGoogleAdsItem1(t("privacy.googleAdsItem1"))
    setGoogleAdsItem2(t("privacy.googleAdsItem2"))
    setGoogleAdsItem3(t("privacy.googleAdsItem3"))
    setGoogleAdsItem4(t("privacy.googleAdsItem4"))
    setGoogleAdsText4(t("privacy.googleAdsText4"))
    setGtm(t("privacy.gtm"))
    setGtmText(t("privacy.gtmText"))
    setMailchimp(t("privacy.mailchimp"))
    setMailchimpText1(t("privacy.mailchimpText1"))
    setMailchimpText2(t("privacy.mailchimpText2"))
    setConferencing(t("privacy.conferencing"))
    setConferencingText1(t("privacy.conferencingText1"))
    setConferencingText2(t("privacy.conferencingText2"))
    setConferencingText3(t("privacy.conferencingText3"))
    setYoutube(t("privacy.youtube"))
    setYoutubeText1(t("privacy.youtubeText1"))
    setYoutubeText2(t("privacy.youtubeText2"))
    setAgency(t("privacy.agency"))
    setAgencyText1(t("privacy.agencyText1"))
    setAgencyText2(t("privacy.agencyText2"))
    setAgencyText3(t("privacy.agencyText3"))
    setCopyrights(t("privacy.copyrights"))
    setCopyrightsText1(t("privacy.copyrightsText1"))
    setCopyrightsText2(t("privacy.copyrightsText2"))
    setDisclaimer(t("privacy.disclaimer"))
    setDisclaimerText1(t("privacy.disclaimerText1"))
    setDisclaimerText2(t("privacy.disclaimerText2"))
    setDisclaimerText3(t("privacy.disclaimerText3"))
    setChanges(t("privacy.changes"))
    setChangesText(t("privacy.changesText"))
    setQuestions(t("privacy.questions"))
    setQuestionsText(t("privacy.questionsText"))
    setDate(t("privacy.date"))
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
          <h2 id="privacy">
            <EditableText
              value={privacyPolicy}
              onChange={setPrivacyPolicy}
              translationKey="privacy.privacyPolicy"
              editMode={editMode}
              as="span"
            />
          </h2>

          <h3 id="controller">
            <EditableText
              value={controller}
              onChange={setController}
              translationKey="privacy.controller"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={controllerText}
              onChange={setControllerText}
              translationKey="privacy.controllerText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <strong>
              <EditableText
                value={companyName}
                onChange={setCompanyName}
                translationKey="privacy.companyName"
                editMode={editMode}
                as="span"
              />
            </strong><br />
            <EditableText
              value={companyAddress}
              onChange={setCompanyAddress}
              translationKey="privacy.companyAddress"
              editMode={editMode}
              as="span"
            /><br />
            <EditableText
              value={companyCity}
              onChange={setCompanyCity}
              translationKey="privacy.companyCity"
              editMode={editMode}
              as="span"
            />
          </p>
          <p>
            <EditableText
              value={email}
              onChange={setEmail}
              translationKey="privacy.email"
              editMode={editMode}
              as="span"
            /> <a href="mailto:purpura@promopers.com">purpura@promopers.com</a><br />
            <EditableText
              value={website}
              onChange={setWebsite}
              translationKey="privacy.website"
              editMode={editMode}
              as="span"
            /> <a href="https://www.promopers.com/privacy" target="_blank" rel="noopener noreferrer">https://www.promopers.com/privacy</a>
          </p>

          <h2 id="general">
            <EditableText
              value={general}
              onChange={setGeneral}
              translationKey="privacy.general"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={generalText1}
              onChange={setGeneralText1}
              translationKey="privacy.generalText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={generalText2}
              onChange={setGeneralText2}
              translationKey="privacy.generalText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={generalText3}
              onChange={setGeneralText3}
              translationKey="privacy.generalText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={generalText4}
              onChange={setGeneralText4}
              translationKey="privacy.generalText4"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="processing">
            <EditableText
              value={processing}
              onChange={setProcessing}
              translationKey="privacy.processing"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={processingText1}
              onChange={setProcessingText1}
              translationKey="privacy.processingText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={processingText2}
              onChange={setProcessingText2}
              translationKey="privacy.processingText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <ul>
            <li>
              <EditableText
                value={processingLitA}
                onChange={setProcessingLitA}
                translationKey="privacy.processingLitA"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={processingLitB}
                onChange={setProcessingLitB}
                translationKey="privacy.processingLitB"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={processingLitC}
                onChange={setProcessingLitC}
                translationKey="privacy.processingLitC"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={processingLitD}
                onChange={setProcessingLitD}
                translationKey="privacy.processingLitD"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={processingLitF}
                onChange={setProcessingLitF}
                translationKey="privacy.processingLitF"
                editMode={editMode}
                as="span"
              />
            </li>
          </ul>
          <p>
            <EditableText
              value={processingText3}
              onChange={setProcessingText3}
              translationKey="privacy.processingText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="cookies">
            <EditableText
              value={cookies}
              onChange={setCookies}
              translationKey="privacy.cookies"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={cookiesText1}
              onChange={setCookiesText1}
              translationKey="privacy.cookiesText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={cookiesText2}
              onChange={setCookiesText2}
              translationKey="privacy.cookiesText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="ssl">
            <EditableText
              value={ssl}
              onChange={setSsl}
              translationKey="privacy.ssl"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={sslText1}
              onChange={setSslText1}
              translationKey="privacy.sslText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={sslText2}
              onChange={setSslText2}
              translationKey="privacy.sslText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="open-networks">
            <EditableText
              value={openNetworks}
              onChange={setOpenNetworks}
              translationKey="privacy.openNetworks"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={openNetworksText1}
              onChange={setOpenNetworksText1}
              translationKey="privacy.openNetworksText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={openNetworksText2}
              onChange={setOpenNetworksText2}
              translationKey="privacy.openNetworksText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={openNetworksText3}
              onChange={setOpenNetworksText3}
              translationKey="privacy.openNetworksText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={openNetworksText4}
              onChange={setOpenNetworksText4}
              translationKey="privacy.openNetworksText4"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="logs">
            <EditableText
              value={logs}
              onChange={setLogs}
              translationKey="privacy.logs"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={logsText1}
              onChange={setLogsText1}
              translationKey="privacy.logsText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <ul>
            <li>
              <EditableText
                value={browserType}
                onChange={setBrowserType}
                translationKey="privacy.browserType"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={operatingSystem}
                onChange={setOperatingSystem}
                translationKey="privacy.operatingSystem"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={referrerUrl}
                onChange={setReferrerUrl}
                translationKey="privacy.referrerUrl"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={hostName}
                onChange={setHostName}
                translationKey="privacy.hostName"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={serverRequest}
                onChange={setServerRequest}
                translationKey="privacy.serverRequest"
                editMode={editMode}
                as="span"
              />
            </li>
          </ul>
          <p>
            <EditableText
              value={logsText2}
              onChange={setLogsText2}
              translationKey="privacy.logsText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="third-parties">
            <EditableText
              value={thirdParties}
              onChange={setThirdParties}
              translationKey="privacy.thirdParties"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={thirdPartiesText1}
              onChange={setThirdPartiesText1}
              translationKey="privacy.thirdPartiesText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={thirdPartiesText2}
              onChange={setThirdPartiesText2}
              translationKey="privacy.thirdPartiesText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={thirdPartiesText3}
              onChange={setThirdPartiesText3}
              translationKey="privacy.thirdPartiesText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={thirdPartiesText4}
              onChange={setThirdPartiesText4}
              translationKey="privacy.thirdPartiesText4"
              editMode={editMode}
              as="span"
              multiline
            /> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{thirdPartiesText4}</a>.
          </p>
          <hr />

          <h2 id="contact-form">
            <EditableText
              value={contactForm}
              onChange={setContactForm}
              translationKey="privacy.contactForm"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={contactFormText}
              onChange={setContactFormText}
              translationKey="privacy.contactFormText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="newsletter">
            <EditableText
              value={newsletter}
              onChange={setNewsletter}
              translationKey="privacy.newsletter"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={newsletterText1}
              onChange={setNewsletterText1}
              translationKey="privacy.newsletterText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={newsletterText2}
              onChange={setNewsletterText2}
              translationKey="privacy.newsletterText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="comments">
            <EditableText
              value={comments}
              onChange={setComments}
              translationKey="privacy.comments"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={commentsText}
              onChange={setCommentsText}
              translationKey="privacy.commentsText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={commentsIp}
              onChange={setCommentsIp}
              translationKey="privacy.commentsIp"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={commentsIpText}
              onChange={setCommentsIpText}
              translationKey="privacy.commentsIpText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={commentsSubscribe}
              onChange={setCommentsSubscribe}
              translationKey="privacy.commentsSubscribe"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={commentsSubscribeText}
              onChange={setCommentsSubscribeText}
              translationKey="privacy.commentsSubscribeText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="rights">
            <EditableText
              value={rights}
              onChange={setRights}
              translationKey="privacy.rights"
              editMode={editMode}
              as="span"
            />
          </h2>
          <h3>
            <EditableText
              value={rightsConfirmation}
              onChange={setRightsConfirmation}
              translationKey="privacy.rightsConfirmation"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsConfirmationText}
              onChange={setRightsConfirmationText}
              translationKey="privacy.rightsConfirmationText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsInfo}
              onChange={setRightsInfo}
              translationKey="privacy.rightsInfo"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsInfoText1}
              onChange={setRightsInfoText1}
              translationKey="privacy.rightsInfoText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <ul>
            <li>
              <EditableText
                value={rightsInfoItem1}
                onChange={setRightsInfoItem1}
                translationKey="privacy.rightsInfoItem1"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsInfoItem2}
                onChange={setRightsInfoItem2}
                translationKey="privacy.rightsInfoItem2"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsInfoItem3}
                onChange={setRightsInfoItem3}
                translationKey="privacy.rightsInfoItem3"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsInfoItem4}
                onChange={setRightsInfoItem4}
                translationKey="privacy.rightsInfoItem4"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsInfoItem5}
                onChange={setRightsInfoItem5}
                translationKey="privacy.rightsInfoItem5"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsInfoItem6}
                onChange={setRightsInfoItem6}
                translationKey="privacy.rightsInfoItem6"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsInfoItem7}
                onChange={setRightsInfoItem7}
                translationKey="privacy.rightsInfoItem7"
                editMode={editMode}
                as="span"
              />
            </li>
          </ul>
          <p>
            <EditableText
              value={rightsInfoText2}
              onChange={setRightsInfoText2}
              translationKey="privacy.rightsInfoText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsInfoText3}
              onChange={setRightsInfoText3}
              translationKey="privacy.rightsInfoText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsRectification}
              onChange={setRightsRectification}
              translationKey="privacy.rightsRectification"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsRectificationText1}
              onChange={setRightsRectificationText1}
              translationKey="privacy.rightsRectificationText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsRectificationText2}
              onChange={setRightsRectificationText2}
              translationKey="privacy.rightsRectificationText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsErasure}
              onChange={setRightsErasure}
              translationKey="privacy.rightsErasure"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsErasureText1}
              onChange={setRightsErasureText1}
              translationKey="privacy.rightsErasureText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <ul>
            <li>
              <EditableText
                value={rightsErasureItem1}
                onChange={setRightsErasureItem1}
                translationKey="privacy.rightsErasureItem1"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsErasureItem2}
                onChange={setRightsErasureItem2}
                translationKey="privacy.rightsErasureItem2"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsErasureItem3}
                onChange={setRightsErasureItem3}
                translationKey="privacy.rightsErasureItem3"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsErasureItem4}
                onChange={setRightsErasureItem4}
                translationKey="privacy.rightsErasureItem4"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsErasureItem5}
                onChange={setRightsErasureItem5}
                translationKey="privacy.rightsErasureItem5"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsErasureItem6}
                onChange={setRightsErasureItem6}
                translationKey="privacy.rightsErasureItem6"
                editMode={editMode}
                as="span"
              />
            </li>
          </ul>
          <p>
            <EditableText
              value={rightsErasureText2}
              onChange={setRightsErasureText2}
              translationKey="privacy.rightsErasureText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsRestriction}
              onChange={setRightsRestriction}
              translationKey="privacy.rightsRestriction"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsRestrictionText1}
              onChange={setRightsRestrictionText1}
              translationKey="privacy.rightsRestrictionText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <ul>
            <li>
              <EditableText
                value={rightsRestrictionItem1}
                onChange={setRightsRestrictionItem1}
                translationKey="privacy.rightsRestrictionItem1"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsRestrictionItem2}
                onChange={setRightsRestrictionItem2}
                translationKey="privacy.rightsRestrictionItem2"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsRestrictionItem3}
                onChange={setRightsRestrictionItem3}
                translationKey="privacy.rightsRestrictionItem3"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={rightsRestrictionItem4}
                onChange={setRightsRestrictionItem4}
                translationKey="privacy.rightsRestrictionItem4"
                editMode={editMode}
                as="span"
              />
            </li>
          </ul>
          <p>
            <EditableText
              value={rightsRestrictionText2}
              onChange={setRightsRestrictionText2}
              translationKey="privacy.rightsRestrictionText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsPortability}
              onChange={setRightsPortability}
              translationKey="privacy.rightsPortability"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsPortabilityText1}
              onChange={setRightsPortabilityText1}
              translationKey="privacy.rightsPortabilityText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsPortabilityText2}
              onChange={setRightsPortabilityText2}
              translationKey="privacy.rightsPortabilityText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsPortabilityText3}
              onChange={setRightsPortabilityText3}
              translationKey="privacy.rightsPortabilityText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsObject}
              onChange={setRightsObject}
              translationKey="privacy.rightsObject"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsObjectText1}
              onChange={setRightsObjectText1}
              translationKey="privacy.rightsObjectText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsObjectText2}
              onChange={setRightsObjectText2}
              translationKey="privacy.rightsObjectText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsObjectText3}
              onChange={setRightsObjectText3}
              translationKey="privacy.rightsObjectText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <h3>
            <EditableText
              value={rightsRevoke}
              onChange={setRightsRevoke}
              translationKey="privacy.rightsRevoke"
              editMode={editMode}
              as="span"
            />
          </h3>
          <p>
            <EditableText
              value={rightsRevokeText1}
              onChange={setRightsRevokeText1}
              translationKey="privacy.rightsRevokeText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={rightsRevokeText2}
              onChange={setRightsRevokeText2}
              translationKey="privacy.rightsRevokeText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="ads-objection">
            <EditableText
              value={adsObjection}
              onChange={setAdsObjection}
              translationKey="privacy.adsObjection"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={adsObjectionText}
              onChange={setAdsObjectionText}
              translationKey="privacy.adsObjectionText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="paid-services">
            <EditableText
              value={paidServices}
              onChange={setPaidServices}
              translationKey="privacy.paidServices"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={paidServicesText}
              onChange={setPaidServicesText}
              translationKey="privacy.paidServicesText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="adwords">
            <EditableText
              value={adwords}
              onChange={setAdwords}
              translationKey="privacy.adwords"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={adwordsText1}
              onChange={setAdwordsText1}
              translationKey="privacy.adwordsText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={adwordsText2}
              onChange={setAdwordsText2}
              translationKey="privacy.adwordsText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={adwordsText3}
              onChange={setAdwordsText3}
              translationKey="privacy.adwordsText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="recaptcha">
            <EditableText
              value={recaptcha}
              onChange={setRecaptcha}
              translationKey="privacy.recaptcha"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={recaptchaText1}
              onChange={setRecaptchaText1}
              translationKey="privacy.recaptchaText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={recaptchaText2}
              onChange={setRecaptchaText2}
              translationKey="privacy.recaptchaText2"
              editMode={editMode}
              as="span"
              multiline
            /> <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy?hl=de</a>
          </p>
          <hr />

          <h2 id="google-ads">
            <EditableText
              value={googleAds}
              onChange={setGoogleAds}
              translationKey="privacy.googleAds"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={googleAdsText1}
              onChange={setGoogleAdsText1}
              translationKey="privacy.googleAdsText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={googleAdsText2}
              onChange={setGoogleAdsText2}
              translationKey="privacy.googleAdsText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={googleAdsText3}
              onChange={setGoogleAdsText3}
              translationKey="privacy.googleAdsText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <ul>
            <li>
              <EditableText
                value={googleAdsItem1}
                onChange={setGoogleAdsItem1}
                translationKey="privacy.googleAdsItem1"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={googleAdsItem2}
                onChange={setGoogleAdsItem2}
                translationKey="privacy.googleAdsItem2"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={googleAdsItem3}
                onChange={setGoogleAdsItem3}
                translationKey="privacy.googleAdsItem3"
                editMode={editMode}
                as="span"
              />
            </li>
            <li>
              <EditableText
                value={googleAdsItem4}
                onChange={setGoogleAdsItem4}
                translationKey="privacy.googleAdsItem4"
                editMode={editMode}
                as="span"
              />
            </li>
          </ul>
          <p>
            <EditableText
              value={googleAdsText4}
              onChange={setGoogleAdsText4}
              translationKey="privacy.googleAdsText4"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="gtm">
            <EditableText
              value={gtm}
              onChange={setGtm}
              translationKey="privacy.gtm"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={gtmText}
              onChange={setGtmText}
              translationKey="privacy.gtmText"
              editMode={editMode}
              as="span"
              multiline
            /> <a href="https://www.google.com/intl/de/tagmanager/use-policy.html" target="_blank" rel="noopener noreferrer">https://www.google.com/intl/de/tagmanager/use-policy.html</a>.
          </p>
          <hr />

          <h2 id="mailchimp">
            <EditableText
              value={mailchimp}
              onChange={setMailchimp}
              translationKey="privacy.mailchimp"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={mailchimpText1}
              onChange={setMailchimpText1}
              translationKey="privacy.mailchimpText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={mailchimpText2}
              onChange={setMailchimpText2}
              translationKey="privacy.mailchimpText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="conferencing">
            <EditableText
              value={conferencing}
              onChange={setConferencing}
              translationKey="privacy.conferencing"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={conferencingText1}
              onChange={setConferencingText1}
              translationKey="privacy.conferencingText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={conferencingText2}
              onChange={setConferencingText2}
              translationKey="privacy.conferencingText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={conferencingText3}
              onChange={setConferencingText3}
              translationKey="privacy.conferencingText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="youtube">
            <EditableText
              value={youtube}
              onChange={setYoutube}
              translationKey="privacy.youtube"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={youtubeText1}
              onChange={setYoutubeText1}
              translationKey="privacy.youtubeText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={youtubeText2}
              onChange={setYoutubeText2}
              translationKey="privacy.youtubeText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="agency">
            <EditableText
              value={agency}
              onChange={setAgency}
              translationKey="privacy.agency"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={agencyText1}
              onChange={setAgencyText1}
              translationKey="privacy.agencyText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={agencyText2}
              onChange={setAgencyText2}
              translationKey="privacy.agencyText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={agencyText3}
              onChange={setAgencyText3}
              translationKey="privacy.agencyText3"
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
              translationKey="privacy.copyrights"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={copyrightsText1}
              onChange={setCopyrightsText1}
              translationKey="privacy.copyrightsText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={copyrightsText2}
              onChange={setCopyrightsText2}
              translationKey="privacy.copyrightsText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="disclaimer">
            <EditableText
              value={disclaimer}
              onChange={setDisclaimer}
              translationKey="privacy.disclaimer"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={disclaimerText1}
              onChange={setDisclaimerText1}
              translationKey="privacy.disclaimerText1"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={disclaimerText2}
              onChange={setDisclaimerText2}
              translationKey="privacy.disclaimerText2"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={disclaimerText3}
              onChange={setDisclaimerText3}
              translationKey="privacy.disclaimerText3"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <hr />

          <h2 id="changes">
            <EditableText
              value={changes}
              onChange={setChanges}
              translationKey="privacy.changes"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={changesText}
              onChange={setChangesText}
              translationKey="privacy.changesText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>

          <h2 id="questions">
            <EditableText
              value={questions}
              onChange={setQuestions}
              translationKey="privacy.questions"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p>
            <EditableText
              value={questionsText}
              onChange={setQuestionsText}
              translationKey="privacy.questionsText"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              value={date}
              onChange={setDate}
              translationKey="privacy.date"
              editMode={editMode}
              as="span"
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

export default function AdminPrivacyPage() {
  return (
    <TextOverridesProvider>
      <EditProvider>
        <AdminPrivacyContent />
      </EditProvider>
    </TextOverridesProvider>
  )
}

