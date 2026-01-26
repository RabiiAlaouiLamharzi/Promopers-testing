"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

interface EditableImageProps {
  src: string
  alt: string
  className?: string
  editMode?: boolean
  onImageChange?: (newSrc: string) => void
  mediaKey?: string // e.g., "hero.video" or "about.factor1"
  section?: string // e.g., "hero", "about", "works"
}

export function EditableImage({ 
  src, 
  alt, 
  className = '', 
  editMode = false,
  onImageChange,
  mediaKey,
  section
}: EditableImageProps) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageChange) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', file.type.startsWith('video/') ? 'video' : 'image')

      const response = await fetch('/api/home/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[EditableImage] Upload successful, URL:', data.url)
        console.log('[EditableImage] Props - section:', section, 'mediaKey:', mediaKey)
        
        onImageChange(data.url)
        
        // Save to JSONBin if mediaKey and section are provided
        if (mediaKey && section) {
          console.log(`[EditableImage] Saving to JSONBin: ${section}.${mediaKey} = ${data.url}`)
          
          const saveResponse = await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section,
              key: mediaKey,
              value: data.url
            })
          })
          
          const saveResult = await saveResponse.json()
          console.log(`[EditableImage] JSONBin save response:`, saveResult)
          
          if (saveResponse.ok) {
            console.log(`[EditableImage] ✅ Saved ${section}.${mediaKey} to JSONBin successfully`)
          } else {
            console.error(`[EditableImage] ❌ Failed to save to JSONBin:`, saveResult)
          }
        } else {
          console.warn('[EditableImage] ⚠️ Missing section or mediaKey, not saving to JSONBin')
          console.log('[EditableImage] section:', section, 'mediaKey:', mediaKey)
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  if (!editMode) {
    return <img src={src} alt={alt} className={className} />
  }

  return (
    <div className="relative editable-image-wrapper w-full h-full group">
      <img src={src} alt={alt} className={className} />
      
      {/* Upload Icon - Blue icon with white round background */}
      <div className="absolute top-4 right-4 z-10">
        <label className="editable-image-upload cursor-pointer flex items-center justify-center bg-white rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-shadow">
          {uploading ? (
            <div className="w-5 h-5 border-4 border-[#002855] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-[#002855]" strokeWidth={2} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}

