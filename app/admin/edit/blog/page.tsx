"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, Trash2, Edit, Plus, X, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"

interface BlogTranslations {
  fr?: {
    title?: string
    content?: string | string[]
  }
  de?: {
    title?: string
    content?: string | string[]
  }
  it?: {
    title?: string
    content?: string | string[]
  }
}

interface Blog {
  id: string
  slug: string
  title: string
  author: string
  date: string
  category: string
  image: string
  content: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  translations?: BlogTranslations
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    author: 'Lukas Berger',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    category: 'Events',
    image: '',
    content: [],
    published: false,
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
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog?admin=true')
      const data = await response.json()
      setBlogs(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive"
      })
      setLoading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Parse HTML content - store as array for compatibility
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const paragraphs = tempDiv.innerText.split(/\n\n+/).filter(p => p.trim())
      
      // Update translations with rich text editor content
      const updatedTranslations = { ...formData.translations }
      ;(['fr', 'de', 'it'] as const).forEach((lang) => {
        if (translationContent[lang] && translationContent[lang].trim()) {
          if (!updatedTranslations[lang]) updatedTranslations[lang] = {}
          updatedTranslations[lang].content = translationContent[lang]
        }
      })
      
      const submitData = {
        ...formData,
        content: content ? [content] : [], // Store HTML content as array
        translations: updatedTranslations
      }

      const url = editingBlog 
        ? `/api/blog/${editingBlog.slug}`
        : '/api/blog'
      
      const method = editingBlog ? 'PUT' : 'POST'

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
        description: editingBlog ? "Blog updated successfully" : "Blog created successfully"
      })

      setEditingBlog(null)
      setIsCreating(false)
      resetForm()
      fetchBlogs()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save blog",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog article?')) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: "Success",
        description: "Blog deleted successfully"
      })

      fetchBlogs()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setIsCreating(false)
    
    // Load content - check if content is HTML or array
    let contentToLoad = ''
    
    if (Array.isArray(blog.content)) {
      // Check if first item is HTML
      if (blog.content.length > 0 && typeof blog.content[0] === 'string' && blog.content[0].includes('<')) {
        contentToLoad = blog.content[0]
      } else {
        contentToLoad = blog.content.filter(Boolean).join('<br><br>')
      }
    } else if (typeof blog.content === 'string') {
      contentToLoad = blog.content
    }
    
    setContent(contentToLoad || '')
    
    // Load translation content for rich text editors
    const translationContentState: { [lang: string]: string } = { fr: '', de: '', it: '' }
    ;(['fr', 'de', 'it'] as const).forEach((lang) => {
      const langTranslations = blog.translations?.[lang]
      if (langTranslations) {
        if (langTranslations.content) {
          if (typeof langTranslations.content === 'string' && langTranslations.content.includes('<')) {
            translationContentState[lang] = langTranslations.content
          } else if (Array.isArray(langTranslations.content)) {
            translationContentState[lang] = langTranslations.content.join('<br><br>')
          } else {
            translationContentState[lang] = langTranslations.content || ''
          }
        }
      }
    })
    setTranslationContent(translationContentState)
    
    setFormData({
      ...blog,
      translations: blog.translations || { fr: {}, de: {}, it: {} }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingBlog(null)
    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setContent('')
    setTranslationContent({ fr: '', de: '', it: '' })
    setFormData({
      title: '',
      slug: '',
      author: 'Lukas Berger',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: 'Events',
      image: '',
      content: [],
      published: false,
      translations: {
        fr: {},
        de: {},
        it: {}
      }
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const categories = ['Events', 'POS Activation', 'Merchandising']

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
            <h1 className="text-4xl font-black text-[#002855] uppercase">Blog Admin</h1>
            <button
              onClick={handleCreate}
              className="bg-[#FFC72C] text-[#002855] px-6 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Blog Article
            </button>
          </div>
        </div>

        {/* Form */}
        {(isCreating || editingBlog) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingBlog ? 'Edit Blog Article' : 'New Blog Article'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setEditingBlog(null)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        title,
                        slug: prev.slug || generateSlug(title)
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
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL *
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.image && (
                  <img src={formData.image} alt="Featured" className="mt-2 w-full h-32 object-cover rounded" />
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog article content here. Use Enter for new lines, formatting buttons for styling..."
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
                          {/* Title */}
                          <div>
                            <label className="block text-sm font-semibold text-[#002855] mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={formData.translations?.[lang]?.title || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                translations: {
                                  ...prev.translations,
                                  [lang]: {
                                    ...prev.translations?.[lang],
                                    title: e.target.value
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
                  {editingBlog ? 'Update' : 'Create'} Blog Article
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingBlog(null)
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

        {/* Blogs List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#002855] mb-4">All Blog Articles</h2>
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-md p-6 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#002855]">{blog.title}</h3>
                  {blog.published ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">Slug: {blog.slug}</p>
                <p className="text-gray-600 text-sm">Category: {blog.category}</p>
                <p className="text-gray-600 text-sm">Date: {blog.date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-[#FFC72C] text-[#002855] px-4 py-2 rounded-lg font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.slug)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              No blog articles found. Create your first blog article!
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

