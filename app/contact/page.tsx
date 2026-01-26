"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Mail, MapPin, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <ContactInfoSection />
        <ContactFormAndMapSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Subtle Luxury Pattern */}
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
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("contact.getInTouch")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">{t("contact.title")}</span>
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

  const contactMethods = [
    {
      icon: <Mail className="w-10 h-10" />,
      title: t("contact.email"),
      label: t("contact.writeUsEmail"),
      value: "info@promopers.com",
      link: "mailto:info@promopers.com"
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: t("contact.location"),
      label: t("contact.findUsAt"),
      value: "Rütistrasse 12, 8952 Schlieren",
      link: "https://maps.google.com/?q=Rütistrasse+12,+8952+Schlieren"
    },
    {
      icon: <Phone className="w-10 h-10" />,
      title: t("contact.phone"),
      label: t("contact.callUsAt"),
      value: "+41 44 500 16 96",
      link: "tel:+41445001696"
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Subtle decorative elements */}
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
                target={method.title === "location" ? "_blank" : undefined}
                rel={method.title === "location" ? "noopener noreferrer" : undefined}
                className="block relative bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 h-full border-2 border-gray-100 group-hover:border-[#FFC72C] group-hover:-translate-y-1 overflow-hidden"
              >
                {/* Icon */}
                <div className="mb-8 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FFC72C]/10 to-[#FFC72C]/20 rounded-2xl flex items-center justify-center text-[#002855] group-hover:from-[#FFC72C] group-hover:to-[#E6B526] group-hover:text-white transition-all duration-300 shadow-lg">
                    {method.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-[#002855] mb-3 uppercase tracking-wide text-center transition-colors duration-300">
                  {method.title}
                </h3>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-px bg-gray-200" />
                  <div className="w-2 h-2 bg-[#FFC72C]/30 rounded-full" />
                  <div className="w-8 h-px bg-gray-200" />
                </div>

                {/* Label */}
                <p className="text-gray-600 text-sm mb-4 text-center font-light">
                  {method.label}
                </p>

                {/* Value */}
                <p className="text-[#002855] font-bold text-lg text-center group-hover:text-[#FFC72C] transition-colors duration-300 leading-relaxed">
                  {method.value}
                </p>

                {/* Corner accent */}
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

  return (
    <section id="contact-form" ref={sectionRef} className="py-20 bg-gray-50" style={{ scrollMarginTop: '30px' }}>
      <div className="luxury-container">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] mb-4 uppercase">
            {t("contact.lookingForPartner")}
          </h2>
          <p className="text-xl text-gray-600 mb-2">{t("contact.newProject")}</p>
          <p className="text-gray-600">
            {t("contact.callUs")}
          </p>
        </div>

        {/* Form and Map Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
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
                  placeholder={t("contact.yourName")}
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
                  placeholder={t("contact.yourMail")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-[#FFC72C] outline-none transition-colors text-[#002855] bg-white"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder={t("contact.projectDetails")}
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
                      {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.sendMessage")}
                      <ArrowRight className="w-5 h-5 text-[#002855]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
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

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="luxury-container">
        <div className={`text-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } transition-all duration-1500`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            {t("contact.readyToWork")}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("contact.discussBrand")}
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
            {t("contact.scheduleCall")}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
