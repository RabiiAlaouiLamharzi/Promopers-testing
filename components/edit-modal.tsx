"use client"

import { useState, useEffect, useRef } from "react"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (value: string) => void
  value: string
  title?: string
  placeholder?: string
}

export function EditModal({
  isOpen,
  onClose,
  onSave,
  value,
  title = "Edit Content",
  placeholder = "Enter text..."
}: EditModalProps) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen])

  const handleSave = () => {
    onSave(inputValue)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-10 z-[999998]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'normal',
            letterSpacing: 'normal'
          }}
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 
              className="text-base text-[#002855]"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                letterSpacing: 'normal'
              }}
            >
              {title}
            </h2>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#FFC72C] focus:outline-none focus:ring-1 focus:ring-[#FFC72C] focus:ring-opacity-50 resize-none text-sm"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                letterSpacing: 'normal'
              }}
              rows={2}
            />
            <p 
              className="mt-2 text-xs text-gray-500"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                letterSpacing: 'normal'
              }}
            >
              Press <kbd 
                className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs"
                style={{ 
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'normal',
                  letterSpacing: 'normal'
                }}
              >
                Enter
              </kbd> to save, <kbd 
                className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs"
                style={{ 
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'normal',
                  letterSpacing: 'normal'
                }}
              >
                Esc
              </kbd> to cancel
            </p>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                letterSpacing: 'normal'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-[#002855] text-white rounded-md hover:bg-[#003D7A] transition-colors"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                letterSpacing: 'normal'
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

