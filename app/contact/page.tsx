"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <ContactHeaderSection />
        <ContactFormAndMapSection />
      </main>
      <Footer />
    </div>
  )
}


function ContactHeaderSection() {
  const { t } = useLanguage()

  return (
    <section className="luxury-section bg-white">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Title */}
          <div>
            <h1 className="text-headline text-[#121830] uppercase">{t("contact.contactLine1")}</h1>
            <h2 className="text-subheadline text-[#2B2F36] uppercase">{t("contact.contactLine2")}</h2>
          </div>

          {/* Contact info */}
          <div className="space-y-6 pt-2">
            {[
              { href: "mailto:info@promopers.com", icon: <Mail className="w-4 h-4" />, label: t("contact.email"), value: "info@promopers.com" },
              { href: "tel:+41445001696", icon: <Phone className="w-4 h-4" />, label: t("contact.phone"), value: "+41 44 500 16 96" },
              { href: "https://maps.google.com/?q=Rütistrasse+12,+8952+Schlieren", icon: <MapPin className="w-4 h-4" />, label: t("contact.location"), value: "Rütistrasse 12, 8952 Schlieren", external: true },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 group hover:opacity-70 transition-opacity py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#121830]/5 flex items-center justify-center text-[#121830] flex-shrink-0 group-hover:bg-[#121830] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-[#121830]">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get access key from environment variable (for Vercel) or use the provided one as fallback
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '043e1710-1882-450f-a66e-86093869654d'
      
      // Recipient email address
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
        
        // Reset form
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

  const inputCls = "w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-[#121830] outline-none transition-colors text-[#121830] bg-white text-sm"

  return (
    <section id="contact-form" ref={sectionRef} className="pb-8 bg-white" style={{ scrollMarginTop: '30px' }}>
      <div className="luxury-container">
        <div className="h-px bg-gray-100 mb-12" />
        <div className={`grid lg:grid-cols-2 gap-12 items-stretch transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#121830]/50 uppercase tracking-widest mb-2">{t("contact.yourName")} *</label>
              <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121830]/50 uppercase tracking-widest mb-2">{t("contact.yourMail")} *</label>
              <input type="email" name="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121830]/50 uppercase tracking-widest mb-2">{t("contact.projectDetails")}</label>
              <textarea name="message" placeholder="Tell us about your project..." value={formData.message} onChange={handleChange} required rows={9} className={`${inputCls} resize-none`} />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FFCE5C] text-[#121830] px-12 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#F5C440] transition-colors inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{t("contact.sending")}</>
              ) : (
                <>{t("contact.sendMessage")}<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Map */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[400px]">
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
    </section>
  )
}

