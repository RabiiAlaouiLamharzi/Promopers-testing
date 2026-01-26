"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, AlertTriangle, Globe, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Reference {
  id: string
  slug: string
  name: string
  description: string[]
  translations?: {
    fr?: Record<string, any>
    de?: Record<string, any>
    it?: Record<string, any>
  }
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
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-green-800 mb-1">Automatic Translation System</h3>
                <p className="text-sm text-green-700">
                  Translations are now stored automatically with each reference in <code className="bg-green-100 px-1 rounded">data/references.json</code>. 
                  Edit translations directly in the admin panel by clicking "Edit" → "Show Translations". 
                  Translations update automatically when you save changes.
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
              // Check if translations exist in the reference data
              const hasTranslations = ref.translations && (
                (ref.translations.fr && Object.keys(ref.translations.fr).length > 0) ||
                (ref.translations.de && Object.keys(ref.translations.de).length > 0) ||
                (ref.translations.it && Object.keys(ref.translations.it).length > 0)
              )

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
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                          <strong>✓ Translations Available:</strong> This reference has translations stored automatically.
                        </p>
                        <p className="text-xs text-green-700 mt-2">
                          To edit translations, go to the <a href="/admin/references" className="underline font-semibold">admin panel</a> and click "Edit" → "Show Translations".
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>No Translations Yet:</strong> This reference will display in English only.
                        </p>
                        <p className="text-xs text-yellow-700 mt-2">
                          To add translations, go to the <a href="/admin/references" className="underline font-semibold">admin panel</a>, click "Edit", then "Show Translations" to add translations for FR, DE, and IT.
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

