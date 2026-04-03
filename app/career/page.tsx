"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Briefcase, ChevronDown, ChevronUp, ExternalLink, Users, Award, Upload, CheckCircle2, Loader2, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Job } from "@/lib/jobs"

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  useEffect(() => { setIsVisible(true) }, [])

  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFC72C]/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="relative z-10 luxury-container text-center px-6">
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-[#FFC72C] bg-white/5 mt-16">
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("careerPage.joinUs")}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">Career</span>
          </h1>
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
  )
}

/* ─── Job card (accordion) ───────────────────────────────────────────────── */
function resolveJob(job: Job, language: string) {
  const t = job.translations?.[language as 'fr' | 'de' | 'it']
  return {
    title: t?.title || job.title,
    type: t?.type || job.type,
    department: t?.department || job.department,
    description: t?.description || job.description,
    requirements: (t?.requirements?.length ? t.requirements : job.requirements) || [],
  }
}

function JobCard({ job, index, language }: { job: Job; index: number; language: string }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const resolved = resolveJob(job, language)

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-[#002855]/30 shadow-lg bg-white"
          : "border-[#002855]/10 hover:border-[#002855]/20 hover:shadow-sm bg-white"
      }`}
    >
      <button
        className="w-full flex items-center justify-between gap-6 px-8 md:px-10 py-7 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-6">
          <span className="text-3xl font-black text-[#002855]/10 tabular-nums leading-none w-10 flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-base md:text-lg font-black text-[#002855] uppercase tracking-wide leading-tight">
              {resolved.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs font-bold text-[#002855] bg-[#FFC72C]/15 px-3 py-1 rounded-full">
                {resolved.type}
              </span>
              <span className="text-xs text-[#003D7A]/50 font-medium uppercase tracking-widest">
                {resolved.department}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
          open ? "border-[#002855] text-[#002855] bg-[#002855]/5" : "border-[#002855]/20 text-[#002855]/40"
        }`}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-8 md:px-10 pb-10 border-t border-[#002855]/8">
          <p className="text-[#003D7A]/75 leading-relaxed mt-7 mb-7 text-sm md:text-base max-w-2xl">
            {resolved.description}
          </p>
          {resolved.requirements.length > 0 && (
            <>
              <p className="text-[10px] font-black text-[#002855]/40 uppercase tracking-[0.2em] mb-4">
                {t("careerPage.whatWeLookFor")}
              </p>
              <ul className="space-y-3">
                {resolved.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-[#003D7A]/80">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FFC72C] flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Application Form ───────────────────────────────────────────────────── */
function ApplicationForm({ jobs }: { jobs: Job[] }) {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const [fields, setFields] = useState({ name: '', email: '', phone: '', position: '', message: '' })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields(prev => ({ ...prev, [k]: e.target.value }))

  const handleFile = (f: File | null) => {
    if (!f) return
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(f.type)) { setError('Please upload a PDF or Word document.'); return }
    if (f.size > 8 * 1024 * 1024) { setError('File must be under 8 MB.'); return }
    setError('')
    setCvFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0] || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      const fd = new FormData()
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
      if (cvFile) fd.append('cv', cvFile)

      const res = await fetch('/api/apply', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed.')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#FFC72C] outline-none transition-colors text-[#002855] bg-white text-sm"

  return (
    <div ref={formRef} className="mt-20">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end mb-12 pb-10 border-b border-[#002855]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
            <Award className="w-4 h-4 text-[#002855]" />
            <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">{t("careerPage.interestedRole")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] uppercase tracking-tight leading-[1.05]">
            {t("careerPage.sendCvTitle")}
          </h2>
        </div>
        <p className="text-[#003D7A]/60 text-base leading-relaxed pb-1">
          {t("careerPage.sendCvText")}
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-black text-[#002855] uppercase mb-3">Application sent!</h3>
          <p className="text-[#003D7A]/70 text-base max-w-md">We have received your application and will get back to you as soon as possible. Thank you!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — personal details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#002855]/60 uppercase tracking-widest mb-2">Full Name *</label>
                <input type="text" value={fields.name} onChange={set('name')} placeholder="Your full name" required className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#002855]/60 uppercase tracking-widest mb-2">Email *</label>
                <input type="email" value={fields.email} onChange={set('email')} placeholder="you@email.com" required className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#002855]/60 uppercase tracking-widest mb-2">Phone</label>
                <input type="tel" value={fields.phone} onChange={set('phone')} placeholder="+41 ..." className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#002855]/60 uppercase tracking-widest mb-2">Position of interest</label>
                <select value={fields.position} onChange={set('position')} className={inputCls}>
                  <option value="">Select a position...</option>
                  {jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                  <option value="Open application">Open application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#002855]/60 uppercase tracking-widest mb-2">Cover letter / Message</label>
              <textarea value={fields.message} onChange={set('message')} placeholder="Tell us a bit about yourself and why you'd like to join PromoPers..." rows={7} className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Right — CV upload + submit */}
          <div className="flex flex-col gap-6">
            {/* Drop zone */}
            <div>
              <label className="block text-xs font-bold text-[#002855]/60 uppercase tracking-widest mb-2">CV / Resume</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 min-h-[220px] px-8 py-10 text-center ${
                  dragOver
                    ? 'border-[#FFC72C] bg-[#FFC72C]/5'
                    : cvFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-[#002855]/20 hover:border-[#002855]/40 bg-[#F8F9FC]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] || null)}
                />
                {cvFile ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                    <p className="text-sm font-semibold text-green-700 break-all">{cvFile.name}</p>
                    <p className="text-xs text-green-500 mt-1">{(cvFile.size / 1024).toFixed(0)} KB</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setCvFile(null) }}
                      className="mt-4 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-[#002855]/25 mb-3" />
                    <p className="text-sm font-semibold text-[#002855] mb-1">Drop your CV here</p>
                    <p className="text-xs text-[#003D7A]/50">or click to browse</p>
                    <p className="text-xs text-[#003D7A]/40 mt-3">PDF, DOC or DOCX — max 8 MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-200">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#FFC72C] text-[#002855] text-sm font-bold uppercase tracking-wider hover:bg-[#e6b526] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-auto"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <>Send Application <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-xs text-[#003D7A]/40 text-center leading-relaxed">
              Your application will be sent to <span className="text-[#003D7A]/60">info@promopers.com</span>. We treat all applications with strict confidentiality.
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

/* ─── Büro Jobs ──────────────────────────────────────────────────────────── */
function BuroJobsSection({ jobs, loadingJobs }: { jobs: Job[]; loadingJobs: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.05 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
            <Award className="w-4 h-4 text-[#002855]" />
            <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">{t("careerPage.openPositionsBadge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#002855] uppercase tracking-tight leading-[1.05]">
            {t("careerPage.buroHeadingLine1")}
            <br />
            <span className="text-[#003D7A]">{t("careerPage.buroHeadingLine2")}</span>
          </h2>
        </div>
        <p className="text-[#003D7A]/60 text-base leading-relaxed pb-1">
          {t("careerPage.buroSubtitle")}
        </p>
      </div>

      {loadingJobs ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-[#003D7A]/50 text-base py-8">No open positions at the moment. Check back soon!</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={job.id} className="transition-all duration-500" style={{ transitionDelay: `${i * 80}ms` }}>
              <JobCard job={job} index={i} language={language} />
            </div>
          ))}
        </div>
      )}

      {/* Application form */}
      <ApplicationForm jobs={jobs} />
    </div>
  )
}

/* ─── Promoter Jobs ──────────────────────────────────────────────────────── */
function PromoterJobsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.05 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const perks = [
    t("careerPage.perk1"),
    t("careerPage.perk2"),
    t("careerPage.perk3"),
    t("careerPage.perk4"),
  ]

  return (
    <div ref={sectionRef} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
            <Users className="w-4 h-4 text-[#002855]" />
            <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">{t("careerPage.fieldForceBadge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#002855] uppercase tracking-tight leading-[1.05]">
            {t("careerPage.promoterHeadingLine1")}
            <br />
            <span className="text-[#003D7A]">{t("careerPage.promoterHeadingLine2")}</span>
          </h2>
        </div>
        <p className="text-[#003D7A]/60 text-base leading-relaxed pb-1">
          {t("careerPage.promoterSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex flex-col justify-between gap-10">
          <div className="space-y-5">
            <p className="text-[#002855] text-xl md:text-2xl font-semibold leading-relaxed">
              {t("careerPage.promoterText1")}
            </p>
            <p className="text-[#003D7A]/65 text-base leading-relaxed">
              {t("careerPage.promoterText2")}
            </p>
          </div>
          <a
            href="https://promopers.staff.cloud/recruiting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#FFC72C] text-[#002855] text-sm font-bold uppercase tracking-wider hover:bg-[#e6b526] transition-colors duration-300 self-start"
          >
            {t("careerPage.viewPositions")}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="relative bg-[#002855] rounded-3xl p-10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC72C] flex items-center justify-center mb-8">
              <Users className="w-6 h-6 text-[#002855]" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 leading-tight">
              {t("careerPage.joinFieldForce")}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              {t("careerPage.joinFieldForceDesc")}
            </p>
            <div className="space-y-3.5">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC72C] flex-shrink-0" />
                  <span className="text-white/70 text-sm">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Page-level CTA ─────────────────────────────────────────────────────── */
function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase">
            {t("contact.readyToWork")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("contact.discussBrand")}
          </p>
          <a
            href="/contact"
            className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors inline-flex items-center gap-3"
          >
            {t("contact.scheduleCall")}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function CareerPage() {
  const [activeTab, setActiveTab] = useState<"buro" | "promoter">("buro")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
      .finally(() => setLoadingJobs(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />

        <section className="luxury-section bg-white">
          <div className="luxury-container">

            {/* Switcher */}
            <div className="flex justify-center mb-20">
              <div className="inline-flex bg-[#F4F5F8] rounded-full p-1.5 border border-[#002855]/8">
                <button
                  onClick={() => setActiveTab("buro")}
                  className={`px-10 py-3.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                    activeTab === "buro"
                      ? "bg-[#002855] text-white shadow-md"
                      : "text-[#003D7A]/50 hover:text-[#002855]"
                  }`}
                >
                  {t("careerPage.buroTab")}
                </button>
                <button
                  onClick={() => setActiveTab("promoter")}
                  className={`px-10 py-3.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                    activeTab === "promoter"
                      ? "bg-[#002855] text-white shadow-md"
                      : "text-[#003D7A]/50 hover:text-[#002855]"
                  }`}
                >
                  {t("careerPage.promoterTab")}
                </button>
              </div>
            </div>

            {activeTab === "buro" ? <BuroJobsSection jobs={jobs} loadingJobs={loadingJobs} /> : <PromoterJobsSection />}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
