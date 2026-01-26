"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, Trash2, Edit, Plus, X, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"

interface ReferenceTranslations {
  fr?: {
    tagline?: string
    description?: string[]
    responsibilities?: string[]
    additionalText?: string | string[]
    tags?: string[]
    location?: string
  }
  de?: {
    tagline?: string
    description?: string[]
    responsibilities?: string[]
    additionalText?: string | string[]
    tags?: string[]
    location?: string
  }
  it?: {
    tagline?: string
    description?: string[]
    responsibilities?: string[]
    additionalText?: string | string[]
    tags?: string[]
    location?: string
  }
}

interface Reference {
  id: string
  slug: string
  name: string
  tagline?: string
  heroImage: string
  logo?: string
  description: string[]
  responsibilities?: string[]
  additionalText?: string | string[]
  services?: string[]
  sectionTitle?: string
  subheading?: string
  additionalDescription?: string[]
  responsibilitiesHeading?: string
  client: string
  location: string
  date: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  translations?: ReferenceTranslations
}

export default function AdminReferencesPage() {
  const [references, setReferences] = useState<Reference[]>([])
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Reference>>({
    name: '',
    slug: '',
    tagline: '',
    heroImage: '',
    logo: '',
    description: [''],
    responsibilities: [],
    additionalText: '',
    client: '',
    location: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    tags: [],
    published: false,
    images: [],
    translations: {
      fr: {},
      de: {},
      it: {}
    }
  })
  
  // Content editor state - stores HTML
  const [content, setContent] = useState<string>('')
  // Translation content editors - stores HTML for each language
  const [translationContent, setTranslationContent] = useState<{ [lang: string]: string }>({
    fr: '',
    de: '',
    it: ''
  })
  const [showTranslations, setShowTranslations] = useState(false)

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      console.log('[Admin] Fetching references...')
      const response = await fetch('/api/references?admin=true', {
        cache: 'no-store', // Force fresh fetch, don't use cache
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log(`[Admin] Fetched ${data.length} references:`, data.map((r: Reference) => ({ slug: r.slug, name: r.name })))
      setReferences(data)
      setLoading(false)
    } catch (error: any) {
      console.error('[Admin] Error fetching references:', error)
      toast({
        title: "Error",
        description: error?.message || "Failed to load references",
        variant: "destructive"
      })
      setLoading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Parse HTML content back into description paragraphs and additional text
      // Store HTML in additionalText field
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const paragraphs = tempDiv.innerText.split(/\n\n+/).filter(p => p.trim())
      
      // Update translations with rich text editor content
      const updatedTranslations = { ...formData.translations }
      ;(['fr', 'de', 'it'] as const).forEach((lang) => {
        if (translationContent[lang] && translationContent[lang].trim()) {
          if (!updatedTranslations[lang]) updatedTranslations[lang] = {}
          updatedTranslations[lang].additionalText = translationContent[lang]
        }
      })
      
      const submitData = {
        ...formData,
        description: paragraphs.length > 0 ? [paragraphs[0]] : [''],
        additionalText: content, // Store full HTML
        translations: updatedTranslations
      }

      const url = editingReference 
        ? `/api/references/${editingReference.slug}`
        : '/api/references'
      
      const method = editingReference ? 'PUT' : 'POST'

      console.log('[Admin] Submitting reference:', { url, method, data: submitData })
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const responseData = await response.json().catch(() => ({ error: 'Failed to parse response' }))
      
      console.log('[Admin] Response status:', response.status, 'Response data:', responseData)

      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error || `HTTP ${response.status}: Failed to save reference`
        console.error('[Admin] Error saving reference:', errorMessage, responseData)
        throw new Error(errorMessage)
      }

      console.log('[Admin] Reference saved successfully:', responseData)

      toast({
        title: "Success",
        description: editingReference ? "Reference updated successfully" : "Reference created successfully"
      })

      setEditingReference(null)
      setIsCreating(false)
      resetForm()
      
      // Add a small delay before fetching to ensure blob storage has propagated
      console.log('[Admin] Waiting 500ms before refreshing list...')
      await new Promise(resolve => setTimeout(resolve, 500))
      fetchReferences()
    } catch (error: any) {
      console.error('[Admin] Error in handleSubmit:', error)
      const errorMessage = error?.message || String(error) || "Failed to save reference"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 10000 // Show for 10 seconds so user can read it
      })
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this reference?')) return

    try {
      const response = await fetch(`/api/references/${slug}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: "Success",
        description: "Reference deleted successfully"
      })

      fetchReferences()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reference",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference)
    setIsCreating(false)
    
    // Load content - ALWAYS use rich text editor for ALL references
    // Priority: additionalText (if HTML), then combine description + additionalText
    let contentToLoad = ''
    
    // Check if additionalText is already HTML (from rich text editor)
    if (typeof reference.additionalText === 'string' && reference.additionalText.includes('<')) {
      // It's HTML content from rich text editor
      contentToLoad = reference.additionalText
    } else {
      // Need to combine description and additionalText
      let desc = ''
      if (Array.isArray(reference.description)) {
        desc = reference.description.filter(Boolean).join('<br><br>')
      } else if (typeof reference.description === 'string') {
        desc = reference.description
      } else if (reference.description) {
        // Handle any other case
        desc = String(reference.description)
      }
      
      let additional = ''
      if (typeof reference.additionalText === 'string') {
        additional = reference.additionalText
      } else if (Array.isArray(reference.additionalText)) {
        additional = reference.additionalText.filter(Boolean).join('<br><br>')
      }
      
      // Combine them, but prefer additionalText if it exists
      if (additional) {
        contentToLoad = desc ? `${desc}<br><br>${additional}` : additional
      } else {
        contentToLoad = desc
      }
    }
    
    // Ensure we always have content, even if empty
    setContent(contentToLoad || '')
    
    // Load translation content for rich text editors
    const translationContentState: { [lang: string]: string } = { fr: '', de: '', it: '' }
    ;(['fr', 'de', 'it'] as const).forEach((lang) => {
      const langTranslations = reference.translations?.[lang]
      if (langTranslations) {
        // Combine translation description and additionalText if exists
        if (langTranslations.additionalText) {
          if (typeof langTranslations.additionalText === 'string' && langTranslations.additionalText.includes('<')) {
            translationContentState[lang] = langTranslations.additionalText
          } else if (Array.isArray(langTranslations.additionalText)) {
            translationContentState[lang] = langTranslations.additionalText.join('<br><br>')
          } else {
            translationContentState[lang] = langTranslations.additionalText || ''
          }
        } else if (langTranslations.description && Array.isArray(langTranslations.description)) {
          translationContentState[lang] = langTranslations.description.join('<br><br>')
        } else if (langTranslations.description && typeof langTranslations.description === 'string') {
          translationContentState[lang] = langTranslations.description
        }
      }
    })
    setTranslationContent(translationContentState)
    
    setFormData({
      ...reference,
      description: Array.isArray(reference.description) ? reference.description : [reference.description || ''],
      translations: reference.translations || { fr: {}, de: {}, it: {} }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingReference(null)
    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setContent('')
    setTranslationContent({ fr: '', de: '', it: '' })
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      heroImage: '',
      logo: '',
      description: [''],
      responsibilities: [],
      additionalText: '',
      client: '',
      location: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tags: [],
      published: false,
      images: [],
      translations: {
        fr: {},
        de: {},
        it: {}
      }
    })
  }

  const addArrayItem = (field: keyof Reference, value: string = '') => {
    const current = formData[field] as string[]
    setFormData(prev => ({
      ...prev,
      [field]: [...(current || []), value]
    }))
  }

  const updateArrayItem = (field: keyof Reference, index: number, value: string) => {
    const current = formData[field] as string[]
    const updated = [...(current || [])]
    updated[index] = value
    setFormData(prev => ({ ...prev, [field]: updated }))
  }

  const removeArrayItem = (field: keyof Reference, index: number) => {
    const current = formData[field] as string[]
    const updated = current?.filter((_, i) => i !== index) || []
    setFormData(prev => ({ ...prev, [field]: updated }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#002855] text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl" style={{ marginTop: '120px' }}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-black text-[#002855] uppercase">References Admin</h1>
            <button
              onClick={handleCreate}
              className="bg-[#FFC72C] text-[#002855] px-6 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Reference
            </button>
          </div>
        </div>

        {/* Form */}
        {(isCreating || editingReference) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingReference ? 'Edit Reference' : 'New Reference'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setEditingReference(null)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info - Simplified */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        name,
                        slug: prev.slug || generateSlug(name),
                        client: prev.client || name
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    placeholder={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    placeholder="e.g., Whole Switzerland"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image URL *
                  </label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  {formData.heroImage && (
                    <img src={formData.heroImage} alt="Hero" className="mt-2 w-full h-32 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article content here. Use Enter for new lines, formatting buttons for styling..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    setFormData(prev => ({ ...prev, tags }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  placeholder="Merchandising, Retail, Marketing"
                />
              </div>

              {/* Translations Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#002855]">Translations</h3>
                  <button
                    type="button"
                    onClick={() => setShowTranslations(!showTranslations)}
                    className="text-[#FFC72C] hover:text-[#E6B526] font-semibold flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    {showTranslations ? 'Hide' : 'Show'} Translations
                  </button>
                </div>

                {showTranslations && (
                  <div className="space-y-6">
                    {(['fr', 'de', 'it'] as const).map((lang) => (
                      <div key={lang} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-bold text-[#002855] mb-4 uppercase">
                          {lang === 'fr' ? 'Français' : lang === 'de' ? 'Deutsch' : 'Italiano'}
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Tagline */}
                          <div>
                            <label className="block text-sm font-semibold text-[#002855] mb-2">
                              Tagline
                            </label>
                            <input
                              type="text"
                              value={formData.translations?.[lang]?.tagline || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                translations: {
                                  ...prev.translations,
                                  [lang]: {
                                    ...prev.translations?.[lang],
                                    tagline: e.target.value
                                  }
                                }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                              placeholder="Leave empty to use English"
                            />
                          </div>

                          {/* Content Editor for Translations */}
                          <div>
                            <label className="block text-sm font-semibold text-[#002855] mb-2">
                              Article Content Translation
                            </label>
                            <RichTextEditor
                              value={translationContent[lang] || ''}
                              onChange={(value) => {
                                setTranslationContent(prev => ({
                                  ...prev,
                                  [lang]: value
                                }))
                              }}
                              placeholder={`Translate the article content here. Leave empty to use English version.`}
                            />
                          </div>

                          {/* Tags & Location */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-[#002855] mb-2">
                                Tags
                              </label>
                              <input
                                type="text"
                                value={formData.translations?.[lang]?.tags?.join(', ') || ''}
                                onChange={(e) => {
                                  const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                  setFormData(prev => ({
                                  ...prev,
                                  translations: {
                                    ...prev.translations,
                                    [lang]: {
                                      ...prev.translations?.[lang],
                                        tags: tags.length > 0 ? tags : undefined
                                      }
                                    }
                                  }))
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                                placeholder="Leave empty to use English tags"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-[#002855] mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                value={formData.translations?.[lang]?.location || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  translations: {
                                    ...prev.translations,
                                    [lang]: {
                                      ...prev.translations?.[lang],
                                      location: e.target.value
                                    }
                                  }
                                }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                                placeholder="Leave empty to use English"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 text-[#FFC72C] rounded focus:ring-[#FFC72C]"
                />
                <label htmlFor="published" className="text-sm font-semibold text-[#002855]">
                  Published
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#FFC72C] text-[#002855] px-8 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {editingReference ? 'Update' : 'Create'} Reference
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingReference(null)
                    resetForm()
                  }}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* References List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#002855] mb-4">All References</h2>
          {references.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-xl shadow-md p-6 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#002855]">{ref.name}</h3>
                  {ref.published ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">Slug: {ref.slug}</p>
                <p className="text-gray-600 text-sm">Date: {ref.date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(ref)}
                  className="bg-[#FFC72C] text-[#002855] px-4 py-2 rounded-lg font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ref.slug)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {references.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              No references found. Create your first reference!
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

