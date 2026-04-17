"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink, Upload, CheckCircle2, Loader2, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Job } from "@/lib/jobs"

/* ─── Hero ───────────────────────────────────────────────────────────────── */

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
          ? "border-[#121830]/30 shadow-lg bg-white"
          : "border-[#121830]/10 hover:border-[#121830]/20 hover:shadow-sm bg-white"
      }`}
    >
      <button
        className="w-full flex items-center justify-between gap-6 px-8 md:px-10 py-7 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-6">
          <span className="text-3xl font-black text-[#121830]/10 tabular-nums leading-none w-10 flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-base md:text-lg font-black text-[#121830] uppercase tracking-wide leading-tight">
              {resolved.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs font-bold text-[#121830] bg-[#FFCE5C]/15 px-3 py-1 rounded-full">
                {resolved.type}
              </span>
              <span className="text-xs text-[#2B2F36]/50 font-medium uppercase tracking-widest">
                {resolved.department}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
          open ? "border-[#121830] text-[#121830] bg-[#121830]/5" : "border-[#121830]/20 text-[#121830]/40"
        }`}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-8 md:px-10 pb-10 border-t border-[#121830]/8">
          <p className="text-[#2B2F36]/75 leading-relaxed mt-7 mb-7 text-sm md:text-base max-w-2xl">
            {resolved.description}
          </p>
          {resolved.requirements.length > 0 && (
            <>
              <p className="text-[10px] font-black text-[#121830]/40 uppercase tracking-[0.2em] mb-4">
                {t("careerPage.whatWeLookFor")}
              </p>
              <ul className="space-y-3">
                {resolved.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-[#2B2F36]/80">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FFCE5C] flex-shrink-0" />
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

  const inputCls = "w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#FFCE5C] outline-none transition-colors text-[#121830] bg-white text-sm"

  return (
    <div ref={formRef} className="mt-20">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16 items-start mb-12 pb-10 border-b border-[#121830]/10">
        <div>
          <h2 className="text-headline text-[#121830] uppercase">{t("careerPage.sendCvTitle")}</h2>
        </div>
        <p className="text-base text-[#2B2F36]/60 leading-relaxed">
          {t("careerPage.sendCvText")}
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-black text-[#121830] uppercase mb-3">Application sent!</h3>
          <p className="text-[#2B2F36]/70 text-base max-w-md">We have received your application and will get back to you as soon as possible. Thank you!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — personal details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#121830]/60 uppercase tracking-widest mb-2">Full Name *</label>
                <input type="text" value={fields.name} onChange={set('name')} placeholder="Your full name" required className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#121830]/60 uppercase tracking-widest mb-2">Email *</label>
                <input type="email" value={fields.email} onChange={set('email')} placeholder="you@email.com" required className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#121830]/60 uppercase tracking-widest mb-2">Phone</label>
                <input type="tel" value={fields.phone} onChange={set('phone')} placeholder="+41 ..." className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#121830]/60 uppercase tracking-widest mb-2">Position of interest</label>
                <select value={fields.position} onChange={set('position')} className={inputCls}>
                  <option value="">Select a position...</option>
                  {jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                  <option value="Open application">Open application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121830]/60 uppercase tracking-widest mb-2">Cover letter / Message</label>
              <textarea value={fields.message} onChange={set('message')} placeholder="Tell us a bit about yourself and why you'd like to join PromoPers..." rows={7} className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Right — CV upload + submit */}
          <div className="flex flex-col gap-6">
            {/* Drop zone */}
            <div>
              <label className="block text-xs font-bold text-[#121830]/60 uppercase tracking-widest mb-2">CV / Resume</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 min-h-[220px] px-8 py-10 text-center ${
                  dragOver
                    ? 'border-[#FFCE5C] bg-[#FFCE5C]/5'
                    : cvFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-[#121830]/20 hover:border-[#121830]/40 bg-[#F8F9FC]'
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
                    <Upload className="w-10 h-10 text-[#121830]/25 mb-3" />
                    <p className="text-sm font-semibold text-[#121830] mb-1">Drop your CV here</p>
                    <p className="text-xs text-[#2B2F36]/50">or click to browse</p>
                    <p className="text-xs text-[#2B2F36]/40 mt-3">PDF, DOC or DOCX — max 8 MB</p>
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
              className="w-full inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#FFCE5C] text-[#121830] text-sm font-bold uppercase tracking-wider hover:bg-[#F5C440] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-auto"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <>Send Application <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-xs text-[#2B2F36]/40 text-center leading-relaxed">
              Your application will be sent to <span className="text-[#2B2F36]/60">info@promopers.com</span>. We treat all applications with strict confidentiality.
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
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16 items-start mb-16">
        <div>
          <h2 className="text-headline text-[#121830] uppercase">{t("careerPage.buroHeadingLine1")}</h2>
          <h3 className="text-subheadline text-[#2B2F36] uppercase">{t("careerPage.buroHeadingLine2")}</h3>
        </div>
        <p className="text-base text-[#2B2F36]/60 leading-relaxed">
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
        <p className="text-[#2B2F36]/50 text-base py-8">No open positions at the moment. Check back soon!</p>
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

  return (
    <div ref={sectionRef} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      {/* Title */}
      <div className="mb-12">
        <h2 className="text-headline text-[#121830] uppercase">{t("careerPage.promoterHeadingLine1")}</h2>
        <h3 className="text-subheadline text-[#2B2F36] uppercase">{t("careerPage.promoterHeadingLine2")}</h3>
      </div>

      {/* Description */}
      <p className="text-[#121830] text-xl md:text-2xl font-semibold leading-relaxed max-w-3xl mb-6">
        {t("careerPage.promoterText1")}
      </p>
      <p className="text-[#2B2F36]/60 text-base leading-relaxed max-w-2xl mb-10">
        {t("careerPage.promoterText2")}
      </p>

      <a
        href="https://promopers.staff.cloud/recruiting"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#FFCE5C] text-[#121830] text-sm font-bold uppercase tracking-wider hover:bg-[#F5C440] transition-colors duration-300"
      >
        {t("careerPage.viewPositions")}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
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
        <section className="luxury-section bg-white">
          <div className="luxury-container">

            {/* Switcher */}
            <div className="flex gap-3 mb-16">
              <button
                onClick={() => setActiveTab("buro")}
                className={`px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                  activeTab === "buro"
                    ? "bg-[#121830] text-white border-[#121830]"
                    : "bg-white text-[#121830]/50 border-[#121830]/20 hover:border-[#121830]/50 hover:text-[#121830]"
                }`}
              >
                {t("careerPage.buroTab")}
              </button>
              <button
                onClick={() => setActiveTab("promoter")}
                className={`px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                  activeTab === "promoter"
                    ? "bg-[#121830] text-white border-[#121830]"
                    : "bg-white text-[#121830]/50 border-[#121830]/20 hover:border-[#121830]/50 hover:text-[#121830]"
                }`}
              >
                {t("careerPage.promoterTab")}
              </button>
            </div>

            {activeTab === "buro" ? <BuroJobsSection jobs={jobs} loadingJobs={loadingJobs} /> : <PromoterJobsSection />}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
