"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Mail, MapPin, Phone, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { EditProvider, useEdit } from "@/contexts/edit-context"
import { TextOverridesProvider, useTextOverrides } from "@/contexts/text-overrides-context"
import { EditableText } from "@/components/editable-text"

function AdminContactContent() {
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
      console.log('[AdminContact] Saving changes...')
      await saveOverrides()
      await reloadOverrides()
      console.log('[AdminContact] ✅ All changes saved and reloaded!')
      toast({
        title: "Saved!",
        description: "Changes saved successfully to database",
      })
    } catch (error) {
      console.error('[AdminContact] ❌ Save failed:', error)
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
          <ContactInfoSection />
          <ContactFormAndMapSection />
          <CTASection />
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
  const [getInTouch, setGetInTouch] = useState(t("contact.getInTouch"))
  const [title, setTitle] = useState(t("contact.title"))

  useEffect(() => {
    setIsVisible(true)
    setGetInTouch(t("contact.getInTouch"))
    setTitle(t("contact.title"))
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
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-[#FFC72C] bg-white/5 mt-16">
            <EditableText
              value={getInTouch}
              onChange={setGetInTouch}
              translationKey="contact.getInTouch"
              editMode={editMode}
              as="span"
              className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]"
            />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <EditableText
              value={title}
              onChange={setTitle}
              translationKey="contact.title"
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

function ContactInfoSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [email, setEmail] = useState(t("contact.email"))
  const [writeUsEmail, setWriteUsEmail] = useState(t("contact.writeUsEmail"))
  const [location, setLocation] = useState(t("contact.location"))
  const [findUsAt, setFindUsAt] = useState(t("contact.findUsAt"))
  const [phone, setPhone] = useState(t("contact.phone"))
  const [callUsAt, setCallUsAt] = useState(t("contact.callUsAt"))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setEmail(t("contact.email"))
    setWriteUsEmail(t("contact.writeUsEmail"))
    setLocation(t("contact.location"))
    setFindUsAt(t("contact.findUsAt"))
    setPhone(t("contact.phone"))
    setCallUsAt(t("contact.callUsAt"))
  }, [t])

  const contactMethods = [
    {
      icon: <Mail className="w-10 h-10" />,
      titleKey: "contact.email",
      title: email,
      setTitle: setEmail,
      labelKey: "contact.writeUsEmail",
      label: writeUsEmail,
      setLabel: setWriteUsEmail,
      value: "info@promopers.com",
      link: "mailto:info@promopers.com"
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      titleKey: "contact.location",
      title: location,
      setTitle: setLocation,
      labelKey: "contact.findUsAt",
      label: findUsAt,
      setLabel: setFindUsAt,
      value: "Rütistrasse 12, 8952 Schlieren",
      link: "https://maps.google.com/?q=Rütistrasse+12,+8952+Schlieren"
    },
    {
      icon: <Phone className="w-10 h-10" />,
      titleKey: "contact.phone",
      title: phone,
      setTitle: setPhone,
      labelKey: "contact.callUsAt",
      label: callUsAt,
      setLabel: setCallUsAt,
      value: "+41 44 500 16 96",
      link: "tel:+41445001696"
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)',
        backgroundSize: '48px 48px'
      }} />
      
      <div className="luxury-container relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <a 
                href={method.link}
                target={method.titleKey === "contact.location" ? "_blank" : undefined}
                rel={method.titleKey === "contact.location" ? "noopener noreferrer" : undefined}
                className="block relative bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 h-full border-2 border-gray-100 group-hover:border-[#FFC72C] group-hover:-translate-y-1 overflow-hidden"
              >
                <div className="mb-8 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FFC72C]/10 to-[#FFC72C]/20 rounded-2xl flex items-center justify-center text-[#002855] group-hover:from-[#FFC72C] group-hover:to-[#E6B526] group-hover:text-white transition-all duration-300 shadow-lg">
                    {method.icon}
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#002855] mb-3 uppercase tracking-wide text-center transition-colors duration-300">
                  <EditableText
                    value={method.title}
                    onChange={method.setTitle}
                    translationKey={method.titleKey}
                    editMode={editMode}
                    as="span"
                  />
                </h3>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-px bg-gray-200" />
                  <div className="w-2 h-2 bg-[#FFC72C]/30 rounded-full" />
                  <div className="w-8 h-px bg-gray-200" />
                </div>

                <p className="text-gray-600 text-sm mb-4 text-center font-light">
                  <EditableText
                    value={method.label}
                    onChange={method.setLabel}
                    translationKey={method.labelKey}
                    editMode={editMode}
                    as="span"
                  />
                </p>

                <p className="text-[#002855] font-bold text-lg text-center group-hover:text-[#FFC72C] transition-colors duration-300 leading-relaxed">
                  {method.value}
                </p>

                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-gray-100 group-hover:border-[#FFC72C] rounded-br-2xl transition-colors duration-300" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactFormAndMapSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [lookingForPartner, setLookingForPartner] = useState(t("contact.lookingForPartner"))
  const [newProject, setNewProject] = useState(t("contact.newProject"))
  const [callUs, setCallUs] = useState(t("contact.callUs"))
  const [yourName, setYourName] = useState(t("contact.yourName"))
  const [yourMail, setYourMail] = useState(t("contact.yourMail"))
  const [projectDetails, setProjectDetails] = useState(t("contact.projectDetails"))
  const [sending, setSending] = useState(t("contact.sending"))
  const [sendMessage, setSendMessage] = useState(t("contact.sendMessage"))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setLookingForPartner(t("contact.lookingForPartner"))
    setNewProject(t("contact.newProject"))
    setCallUs(t("contact.callUs"))
    setYourName(t("contact.yourName"))
    setYourMail(t("contact.yourMail"))
    setProjectDetails(t("contact.projectDetails"))
    setSending(t("contact.sending"))
    setSendMessage(t("contact.sendMessage"))
  }, [t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '043e1710-1882-450f-a66e-86093869654d'
      const recipientEmail = 'berger@promopers.com'

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Contact Form Submission from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          to: recipientEmail,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t("contact.messageSent"),
          description: t("contact.messageSentDesc"),
          variant: "default",
        })
        
        setFormData({
          name: '',
          email: '',
          message: ''
        })
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: t("contact.messageFailed"),
        description: error instanceof Error ? error.message : t("contact.messageFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact-form" ref={sectionRef} className="py-20 bg-gray-50" style={{ scrollMarginTop: '30px' }}>
      <div className="luxury-container">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] mb-4 uppercase">
            <EditableText
              value={lookingForPartner}
              onChange={setLookingForPartner}
              translationKey="contact.lookingForPartner"
              editMode={editMode}
              as="span"
            />
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            <EditableText
              value={newProject}
              onChange={setNewProject}
              translationKey="contact.newProject"
              editMode={editMode}
              as="span"
            />
          </p>
          <p className="text-gray-600">
            <EditableText
              value={callUs}
              onChange={setCallUs}
              translationKey="contact.callUs"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={yourName}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-[#FFC72C] outline-none transition-colors text-[#002855] bg-white"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={yourMail}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-[#FFC72C] outline-none transition-colors text-[#002855] bg-white"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder={projectDetails}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={11}
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-[#FFC72C] outline-none transition-colors resize-none text-[#002855] bg-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-bold text-lg hover:bg-[#E6B526] transition-colors inline-flex items-center justify-center gap-3 shadow-lg shadow-[#FFC72C]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {sending}
                    </>
                  ) : (
                    <>
                      {sendMessage}
                      <ArrowRight className="w-5 h-5 text-[#002855]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ height: '566px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2701.445844755859!2d8.450222!3d47.4005313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900c7657a0233b%3A0xb597a1aec1b990cc!2sX-Tool%20Services%20(Schweiz)%20AG!5e0!3m2!1sen!2sch!4v1699999999999!5m2!1sen!2sch"
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="X-Tool Services (Schweiz) AG Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { editMode } = useEdit()
  const [readyToWork, setReadyToWork] = useState(t("contact.readyToWork"))
  const [discussBrand, setDiscussBrand] = useState(t("contact.discussBrand"))
  const [scheduleCall, setScheduleCall] = useState(t("contact.scheduleCall"))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setReadyToWork(t("contact.readyToWork"))
    setDiscussBrand(t("contact.discussBrand"))
    setScheduleCall(t("contact.scheduleCall"))
  }, [t])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="luxury-container">
        <div className={`text-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } transition-all duration-1500`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            <EditableText
              value={readyToWork}
              onChange={setReadyToWork}
              translationKey="contact.readyToWork"
              editMode={editMode}
              as="span"
            />
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            <EditableText
              value={discussBrand}
              onChange={setDiscussBrand}
              translationKey="contact.discussBrand"
              editMode={editMode}
              as="span"
              multiline
            />
          </p>

          <a 
            href="#contact-form" 
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('contact-form')
              if (element) {
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                window.scrollTo({
                  top: elementPosition - 30,
                  behavior: 'smooth'
                })
              }
            }}
            className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors flex items-center gap-3 mx-auto inline-flex w-auto"
          >
            <EditableText
              value={scheduleCall}
              onChange={setScheduleCall}
              translationKey="contact.scheduleCall"
              editMode={editMode}
              as="span"
            />
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function AdminContactPage() {
  return (
    <TextOverridesProvider>
      <EditProvider>
        <AdminContactContent />
      </EditProvider>
    </TextOverridesProvider>
  )
}

