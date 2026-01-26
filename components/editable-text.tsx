"use client"

import { Edit2 } from "lucide-react"
import { useTextOverrides } from "@/contexts/text-overrides-context"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  translationKey?: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  multiline?: boolean
  editMode?: boolean
  dark?: boolean
}

export function EditableText({ 
  value, 
  onChange, 
  translationKey,
  className = '', 
  as: Component = 'span',
  multiline = false,
  editMode = false,
  dark = false
}: EditableTextProps) {
  const { setOverride } = useTextOverrides()

  if (!editMode) {
    return <Component className={className}>{value}</Component>
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    const newValue = prompt('Edit text:', value)
    // Allow empty strings - check !== null means user didn't cancel
    if (newValue !== null && newValue !== value) {
      console.log('[EditableText] Text changed:', { translationKey, oldValue: value, newValue })
      onChange(newValue)
      // Save to overrides if translationKey is provided (including empty strings)
      if (translationKey) {
        console.log('[EditableText] Saving to overrides:', translationKey, '=', newValue)
        setOverride(translationKey, newValue)
      } else {
        console.warn('[EditableText] ⚠️ No translationKey provided, changes will NOT persist!')
      }
    }
  }

  // Don't render anything if value is empty and not in edit mode
  if (!value && !editMode) {
    return null
  }

  // In edit mode, show edit button even if empty (but no text)
  if (editMode && !value) {
    return (
      <button
        onClick={handleEdit}
        className="edit-icon inline-flex items-center p-1 bg-transparent border-none"
        type="button"
        title="Click to add text"
      >
        <Edit2 className="w-4 h-4 text-gray-400 hover:text-[#002855] transition-colors" strokeWidth={2} />
      </button>
    )
  }

  return (
    <Component
      onClick={(e) => {
        e.stopPropagation()
      }}
      className={`${className} editable-text inline-flex items-center gap-2 group`}
    >
      <span>{value}</span>
      {editMode && (
        <button
          onClick={handleEdit}
          className="edit-icon flex-shrink-0 p-0 bg-transparent border-none"
          type="button"
        >
          <Edit2 className="w-5 h-5 text-gray-600 hover:text-[#002855] transition-colors" strokeWidth={2} />
        </button>
      )}
    </Component>
  )
}

