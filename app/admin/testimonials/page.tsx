"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, Trash2, Edit, Plus, X, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Testimonial } from "@/lib/testimonials"

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    author: '',
    position: '',
    quote: '',
    image: '',
    authorImage: '',
    order: 0,
    published: false,
    translations: {
      fr: {},
      de: {},
      it: {}
    }
  })

  const [translationData, setTranslationData] = useState<{ [lang: string]: { quote: string, position: string } }>({
    fr: { quote: '', position: '' },
    de: { quote: '', position: '' },
    it: { quote: '', position: '' }
  })
  const [showTranslations, setShowTranslations] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])


  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?admin=true')
      const data = await response.json()
      setTestimonials(data.sort((a: Testimonial, b: Testimonial) => a.order - b.order))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const updatedTranslations = { ...formData.translations }
      ;(['fr', 'de', 'it'] as const).forEach((lang) => {
        if (translationData[lang] && (translationData[lang].quote || translationData[lang].position)) {
          if (!updatedTranslations[lang]) updatedTranslations[lang] = {}
          if (translationData[lang].quote) updatedTranslations[lang].quote = translationData[lang].quote
          if (translationData[lang].position) updatedTranslations[lang].position = translationData[lang].position
        }
      })
      
      const submitData = {
        ...formData,
        translations: updatedTranslations
      }

      const url = editingTestimonial 
        ? `/api/testimonials/${editingTestimonial.id}`
        : '/api/testimonials'
      
      const method = editingTestimonial ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      toast({
        title: "Success",
        description: editingTestimonial ? "Testimonial updated successfully" : "Testimonial created successfully"
      })

      setEditingTestimonial(null)
      setIsCreating(false)
      resetForm()
      fetchTestimonials()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save testimonial",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: "Success",
        description: "Testimonial deleted successfully"
      })

      fetchTestimonials()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      author: testimonial.author,
      position: testimonial.position,
      quote: testimonial.quote,
      image: testimonial.image,
      authorImage: testimonial.authorImage,
      order: testimonial.order,
      published: testimonial.published,
      translations: testimonial.translations || { fr: {}, de: {}, it: {} }
    })
    setTranslationData({
      fr: {
        quote: testimonial.translations?.fr?.quote || '',
        position: testimonial.translations?.fr?.position || ''
      },
      de: {
        quote: testimonial.translations?.de?.quote || '',
        position: testimonial.translations?.de?.position || ''
      },
      it: {
        quote: testimonial.translations?.it?.quote || '',
        position: testimonial.translations?.it?.position || ''
      }
    })
    setIsCreating(true)
    setShowTranslations(false)
  }

  const resetForm = () => {
    setFormData({
      author: '',
      position: '',
      quote: '',
      image: '',
      authorImage: '',
      order: 0,
      published: false,
      translations: { fr: {}, de: {}, it: {} }
    })
    setTranslationData({
      fr: { quote: '', position: '' },
      de: { quote: '', position: '' },
      it: { quote: '', position: '' }
    })
    setEditingTestimonial(null)
    setIsCreating(false)
    setShowTranslations(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-12 max-w-7xl" style={{ marginTop: '120px' }}>
          <div className="text-center">Loading testimonials...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-7xl" style={{ marginTop: '120px' }}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-black text-[#002855] uppercase">Testimonials Admin</h1>
            <button
              onClick={() => {
                resetForm()
                setIsCreating(true)
              }}
              className="bg-[#FFC72C] text-[#002855] px-6 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Testimonial
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#002855]">
                {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position (English)</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote (English)</label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Background" className="mt-2 w-full h-32 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Image URL</label>
                  <input
                    type="text"
                    value={formData.authorImage}
                    onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                    placeholder="https://example.com/author.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                  {formData.authorImage && (
                    <img src={formData.authorImage} alt="Author" className="mt-2 w-16 h-16 object-cover rounded-full" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-[#FFC72C] border-gray-300 rounded focus:ring-[#FFC72C]"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="flex items-center gap-2 text-[#002855] font-semibold mb-4"
                >
                  <Globe className="w-5 h-5" />
                  {showTranslations ? 'Hide' : 'Show'} Translations
                </button>

                {showTranslations && (
                  <div className="space-y-6">
                    {(['fr', 'de', 'it'] as const).map((lang) => (
                      <div key={lang} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-[#002855] mb-3 uppercase">{lang}</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quote ({lang.toUpperCase()})</label>
                            <textarea
                              value={translationData[lang].quote}
                              onChange={(e) => setTranslationData({
                                ...translationData,
                                [lang]: { ...translationData[lang], quote: e.target.value }
                              })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position ({lang.toUpperCase()})</label>
                            <input
                              type="text"
                              value={translationData[lang].position}
                              onChange={(e) => setTranslationData({
                                ...translationData,
                                [lang]: { ...translationData[lang], position: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#002855] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003D7A] transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#002855] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quote</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Published</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No testimonials found. Create your first testimonial!
                    </td>
                  </tr>
                ) : (
                  testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testimonial.order}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testimonial.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{testimonial.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{testimonial.quote}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${testimonial.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {testimonial.published ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(testimonial)}
                            className="text-[#FFC72C] hover:text-[#E6B526]"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

