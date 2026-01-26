"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, AlertTriangle, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Reference {
  id: string
  slug: string
  name: string
  description: string[]
}

export default function TranslationsPage() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      const response = await fetch('/api/references?admin=true')
      const data = await response.json()
      setReferences(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching references:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl" style={{ marginTop: '120px' }}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-[#FFC72C]" />
            <h1 className="text-4xl font-black text-[#002855] uppercase">Translation Management</h1>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Translation Status</h3>
                <p className="text-sm text-yellow-700">
                  Translations are stored in <code className="bg-yellow-100 px-1 rounded">lib/translations.ts</code>. 
                  When you modify content in the admin panel, you need to manually update translations. 
                  New references will only display in English until translations are added.
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#002855]">Loading...</div>
        ) : (
          <div className="space-y-6">
            {references.map((ref) => {
              const slugToKey: Record<string, string> = {
                'samsung': 'samsung',
                'coca-cola': 'cocaCola',
                'jbl': 'jbl',
                'arlo': 'arlo',
                'asus': 'asus'
              }
              const clientKey = slugToKey[ref.slug] || ref.slug.replace(/-/g, '')
              const hasTranslations = ['samsung', 'cocaCola', 'jbl', 'arlo', 'asus'].includes(clientKey)

              return (
                <div key={ref.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#002855]">{ref.name}</h3>
                      <p className="text-sm text-gray-600">Slug: {ref.slug}</p>
                      <p className="text-sm text-gray-600">Translation Key: <code className="bg-gray-100 px-1 rounded">references.{clientKey}</code></p>
                    </div>
                    {hasTranslations ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Has Translations
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Missing Translations
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[#002855] mb-2">Current Description Paragraphs:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {ref.description?.map((desc, index) => (
                          <li key={index} className="truncate max-w-3xl">
                            {desc.substring(0, 100)}...
                          </li>
                        ))}
                      </ul>
                    </div>

                    {hasTranslations ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>To update translations:</strong> Edit <code className="bg-blue-100 px-1 rounded">lib/translations.ts</code> and update the keys:
                        </p>
                        <ul className="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
                          <li><code>references.{clientKey}.description1</code></li>
                          <li><code>references.{clientKey}.description2</code> (if exists)</li>
                          <li><code>references.{clientKey}.description3</code> (if exists)</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                          <strong>Action Required:</strong> Add translations for this reference in all languages (EN, FR, DE, IT) in <code className="bg-red-100 px-1 rounded">lib/translations.ts</code>
                        </p>
                        <p className="text-xs text-red-700 mt-2">
                          Add under <code>references.{clientKey}.description1</code>, <code>description2</code>, etc. for each paragraph.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

