"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, Trash2, Edit, Plus, X, Globe, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Job } from "@/lib/jobs"

const LANGS = ['fr', 'de', 'it'] as const

const emptyForm = (): Partial<Job> => ({
  title: '',
  type: 'Full-time',
  department: '',
  description: '',
  requirements: [''],
  order: 0,
  published: false,
  translations: { fr: {}, de: {}, it: {} },
})

const emptyTranslations = () => ({
  fr: { title: '', type: '', department: '', description: '', requirements: [''] },
  de: { title: '', type: '', department: '', description: '', requirements: [''] },
  it: { title: '', type: '', department: '', description: '', requirements: [''] },
})

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showTranslations, setShowTranslations] = useState(false)
  const [expandedLang, setExpandedLang] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Job>>(emptyForm())
  const [translationData, setTranslationData] = useState(emptyTranslations())

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?admin=true')
      const data = await res.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: "Error", description: "Failed to load jobs", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm())
    setTranslationData(emptyTranslations())
    setEditingJob(null)
    setIsCreating(false)
    setShowTranslations(false)
    setExpandedLang(null)
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      type: job.type,
      department: job.department,
      description: job.description,
      requirements: job.requirements?.length ? job.requirements : [''],
      order: job.order,
      published: job.published,
      translations: job.translations || { fr: {}, de: {}, it: {} },
    })
    setTranslationData({
      fr: {
        title: job.translations?.fr?.title || '',
        type: job.translations?.fr?.type || '',
        department: job.translations?.fr?.department || '',
        description: job.translations?.fr?.description || '',
        requirements: job.translations?.fr?.requirements?.length ? job.translations.fr.requirements : [''],
      },
      de: {
        title: job.translations?.de?.title || '',
        type: job.translations?.de?.type || '',
        department: job.translations?.de?.department || '',
        description: job.translations?.de?.description || '',
        requirements: job.translations?.de?.requirements?.length ? job.translations.de.requirements : [''],
      },
      it: {
        title: job.translations?.it?.title || '',
        type: job.translations?.it?.type || '',
        department: job.translations?.it?.department || '',
        description: job.translations?.it?.description || '',
        requirements: job.translations?.it?.requirements?.length ? job.translations.it.requirements : [''],
      },
    })
    setIsCreating(true)
    setShowTranslations(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const translations: Job['translations'] = {}
      LANGS.forEach((lang) => {
        const t = translationData[lang]
        const hasContent = t.title || t.description || t.requirements.some(r => r.trim())
        if (hasContent) {
          translations[lang] = {
            ...(t.title && { title: t.title }),
            ...(t.type && { type: t.type }),
            ...(t.department && { department: t.department }),
            ...(t.description && { description: t.description }),
            ...(t.requirements.some(r => r.trim()) && { requirements: t.requirements.filter(r => r.trim()) }),
          }
        }
      })

      const payload = {
        ...formData,
        requirements: (formData.requirements || []).filter((r: string) => r.trim()),
        translations,
      }

      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs'
      const method = editingJob ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')

      toast({ title: "Success", description: editingJob ? "Job updated" : "Job created" })
      resetForm()
      fetchJobs()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job offer?')) return
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast({ title: "Success", description: "Job deleted" })
      fetchJobs()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  /* helpers for dynamic requirement lists */
  const updateReq = (index: number, value: string) => {
    const reqs = [...(formData.requirements || [])]
    reqs[index] = value
    setFormData({ ...formData, requirements: reqs })
  }
  const addReq = () => setFormData({ ...formData, requirements: [...(formData.requirements || []), ''] })
  const removeReq = (index: number) => {
    const reqs = (formData.requirements || []).filter((_, i) => i !== index)
    setFormData({ ...formData, requirements: reqs.length ? reqs : [''] })
  }

  const updateTransReq = (lang: typeof LANGS[number], index: number, value: string) => {
    const reqs = [...(translationData[lang].requirements || [])]
    reqs[index] = value
    setTranslationData({ ...translationData, [lang]: { ...translationData[lang], requirements: reqs } })
  }
  const addTransReq = (lang: typeof LANGS[number]) => {
    const reqs = [...(translationData[lang].requirements || []), '']
    setTranslationData({ ...translationData, [lang]: { ...translationData[lang], requirements: reqs } })
  }
  const removeTransReq = (lang: typeof LANGS[number], index: number) => {
    const reqs = (translationData[lang].requirements || []).filter((_, i) => i !== index)
    setTranslationData({ ...translationData, [lang]: { ...translationData[lang], requirements: reqs.length ? reqs : [''] } })
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent text-sm"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-12 max-w-5xl" style={{ marginTop: '120px' }}>
          <p className="text-gray-500">Loading jobs...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl" style={{ marginTop: '120px' }}>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#002855] uppercase">Job Offers</h1>
            <p className="text-gray-500 text-sm mt-1">Add, edit or remove office job listings on the career page.</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsCreating(true) }}
            className="bg-[#FFC72C] text-[#002855] px-6 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Job
          </button>
        </div>

        {/* Form */}
        {isCreating && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-[#002855]/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#002855]">
                {editingJob ? 'Edit Job Offer' : 'Create New Job Offer'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Row 1: title + type + department */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className={labelCls}>Job Title (EN) *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Employment Type (EN)</label>
                  <input type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="Full-time" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Department (EN)</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="Operations" className={inputCls} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description (EN)</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className={inputCls} />
              </div>

              {/* Requirements */}
              <div>
                <label className={labelCls}>Requirements (EN)</label>
                <div className="space-y-2">
                  {(formData.requirements || ['']).map((req: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={req} onChange={e => updateReq(i, e.target.value)} placeholder={`Requirement ${i + 1}`} className={inputCls} />
                      <button type="button" onClick={() => removeReq(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addReq} className="text-[#002855] text-sm font-medium flex items-center gap-1 hover:text-[#003D7A]">
                    <Plus className="w-4 h-4" /> Add requirement
                  </button>
                </div>
              </div>

              {/* Order + Published */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className={inputCls} />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 text-[#FFC72C] border-gray-300 rounded" />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
                </div>
              </div>

              {/* Translations */}
              <div className="border-t border-gray-100 pt-6">
                <button type="button" onClick={() => setShowTranslations(!showTranslations)} className="flex items-center gap-2 text-[#002855] font-semibold mb-4 hover:text-[#003D7A]">
                  <Globe className="w-5 h-5" />
                  {showTranslations ? 'Hide' : 'Show'} Translations (FR / DE / IT)
                </button>

                {showTranslations && (
                  <div className="space-y-3">
                    {LANGS.map((lang) => (
                      <div key={lang} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          className="w-full flex justify-between items-center px-5 py-3 bg-gray-50 hover:bg-gray-100 text-left"
                          onClick={() => setExpandedLang(expandedLang === lang ? null : lang)}
                        >
                          <span className="font-bold text-[#002855] uppercase tracking-wider text-sm">{lang === 'fr' ? '🇫🇷 French' : lang === 'de' ? '🇩🇪 German' : '🇮🇹 Italian'}</span>
                          {expandedLang === lang ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {expandedLang === lang && (
                          <div className="p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className={labelCls}>Title ({lang.toUpperCase()})</label>
                                <input type="text" value={translationData[lang].title} onChange={e => setTranslationData({ ...translationData, [lang]: { ...translationData[lang], title: e.target.value } })} className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>Type ({lang.toUpperCase()})</label>
                                <input type="text" value={translationData[lang].type} onChange={e => setTranslationData({ ...translationData, [lang]: { ...translationData[lang], type: e.target.value } })} className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>Department ({lang.toUpperCase()})</label>
                                <input type="text" value={translationData[lang].department} onChange={e => setTranslationData({ ...translationData, [lang]: { ...translationData[lang], department: e.target.value } })} className={inputCls} />
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>Description ({lang.toUpperCase()})</label>
                              <textarea value={translationData[lang].description} onChange={e => setTranslationData({ ...translationData, [lang]: { ...translationData[lang], description: e.target.value } })} rows={3} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Requirements ({lang.toUpperCase()})</label>
                              <div className="space-y-2">
                                {(translationData[lang].requirements || ['']).map((req, i) => (
                                  <div key={i} className="flex gap-2">
                                    <input type="text" value={req} onChange={e => updateTransReq(lang, i, e.target.value)} placeholder={`Requirement ${i + 1}`} className={inputCls} />
                                    <button type="button" onClick={() => removeTransReq(lang, i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <button type="button" onClick={() => addTransReq(lang)} className="text-[#002855] text-sm font-medium flex items-center gap-1 hover:text-[#003D7A]">
                                  <Plus className="w-4 h-4" /> Add requirement
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex items-center gap-2 bg-[#002855] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#003D7A] transition-colors">
                  <Save className="w-4 h-4" />
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#002855]/8">
          {jobs.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-lg font-medium mb-2">No job offers yet</p>
              <p className="text-sm">Click "New Job" to add your first job listing.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#002855] text-white">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Dept.</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Published</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm text-gray-500">{job.order}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#002855]">{job.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{job.type}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{job.department}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${job.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {job.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(job)} className="text-[#FFC72C] hover:text-[#E6B526]">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(job.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
