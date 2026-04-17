"use client"

import { useState } from "react"
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

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

  const inputCls = "w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#121830] outline-none transition-colors text-[#121830] bg-white text-sm"

  return (
    <section id="contact-form" className="pb-8 bg-white" style={{ scrollMarginTop: '30px' }}>
      <div className="luxury-container">
        <div className="h-px bg-gray-100 mb-12" />
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-[#F7F8FA] rounded-3xl p-8 border border-gray-200">
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
          <a
            href="https://maps.google.com/?q=Rütistrasse+12,+8952+Schlieren"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex flex-col items-center justify-center gap-6 bg-[#F7F8FA] border border-gray-100 group hover:border-[#121830]/20 transition-all duration-300 no-underline"
          >
            {/* Map grid background */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(#121830 1px, transparent 1px), linear-gradient(90deg, #121830 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
            {/* Pin */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#121830] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-[#FFCE5C]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#121830] uppercase tracking-widest mb-1">X-Tool Services (Schweiz) AG</p>
                <p className="text-sm text-[#2B2F36]">Rütistrasse 12, 8952 Schlieren</p>
              </div>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121830] text-white text-xs font-bold uppercase tracking-wider group-hover:bg-[#FFCE5C] group-hover:text-[#121830] transition-all duration-300">
                Open in Google Maps <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

