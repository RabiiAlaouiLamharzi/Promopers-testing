"use client"

import { useRef, useEffect, useState } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Video, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Enter your content here..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedSelectionRef = useRef<{ range: Range; text: string } | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  
  // Save selection when button is about to be clicked
  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      try {
        const range = selection.getRangeAt(0)
        const container = range.commonAncestorContainer
        if (editorRef.current.contains(container)) {
          savedSelectionRef.current = {
            range: range.cloneRange(),
            text: range.toString()
          }
        } else {
          savedSelectionRef.current = null
        }
      } catch (e) {
        savedSelectionRef.current = null
      }
    } else {
      savedSelectionRef.current = null
    }
  }

  // Normalize HTML to ensure consistent formatting
  const normalizeHTML = (html: string): string => {
    if (!html || !html.trim()) return ''
    
    try {
      // Create a temporary div to parse and normalize the HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html.trim()
      
      // Remove empty paragraphs
      const emptyPs = tempDiv.querySelectorAll('p')
      emptyPs.forEach(p => {
        if (!p.textContent?.trim() && !p.querySelector('img, iframe, video')) {
          p.remove()
        }
      })
      
      // Normalize line breaks - convert double <br> to paragraph breaks
      let normalized = tempDiv.innerHTML
        .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>')
        .replace(/(<\/p>)\s*(<p>)/gi, '$1$2')
        .replace(/<p>\s*<\/p>/gi, '') // Remove empty paragraphs
      
      // Ensure content starts and ends properly
      if (normalized && !normalized.startsWith('<')) {
        normalized = `<p>${normalized}</p>`
      }
      
      return normalized || html
    } catch (e) {
      console.error('Error normalizing HTML:', e)
      return html
    }
  }

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const normalized = normalizeHTML(value)
      editorRef.current.innerHTML = normalized
    }
    // Style all images in the editor
    if (editorRef.current) {
      const images = editorRef.current.querySelectorAll('img')
      images.forEach(img => {
        const htmlImg = img as HTMLImageElement
        htmlImg.style.width = '100%'
        htmlImg.style.aspectRatio = '16 / 9'
        htmlImg.style.objectFit = 'cover'
        htmlImg.style.display = 'block'
        htmlImg.style.margin = '1rem 0'
      })
      
      // Style all iframes (YouTube videos) in the editor
      const iframes = editorRef.current.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        const htmlIframe = iframe as HTMLIFrameElement
        const isShort = htmlIframe.getAttribute('data-short') === 'true'
        htmlIframe.style.width = '100%'
        htmlIframe.style.aspectRatio = isShort ? '1 / 1' : '16 / 9'
        htmlIframe.style.display = 'block'
        htmlIframe.style.margin = '1rem 0'
        htmlIframe.style.border = 'none'
      })
      
      // Normalize all paragraphs to ensure consistent styling
      const paragraphs = editorRef.current.querySelectorAll('p')
      paragraphs.forEach(p => {
        const htmlP = p as HTMLParagraphElement
        // Remove inline styles that might cause size inconsistencies
        htmlP.removeAttribute('style')
        // Ensure consistent font size
        if (!htmlP.style.fontSize) {
          htmlP.style.fontSize = '1rem'
        }
      })
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      // Normalize the HTML before saving to ensure consistency
      const normalized = normalizeHTML(editorRef.current.innerHTML)
      onChange(normalized)
    }
  }

  const execCommand = (command: string, value: string = '') => {
    editorRef.current?.focus()
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      // Ensure the range is within the editor
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        document.execCommand(command, false, value)
        handleInput()
      }
    } else {
      document.execCommand(command, false, value)
      handleInput()
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (!url || !url.trim()) return

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      alert('Please enter a valid image URL (e.g., https://example.com/image.jpg)')
      return
    }

    // Insert image with styling for 16:9 aspect ratio and full width
    const img = document.createElement('img')
    img.src = url.trim()
    img.style.width = '100%'
    img.style.aspectRatio = '16 / 9'
    img.style.objectFit = 'cover'
    img.style.display = 'block'
    img.style.margin = '1rem 0'
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(img)
      // Move cursor after the image
      range.setStartAfter(img)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editorRef.current?.appendChild(img)
    }
    
    handleInput()
  }

  const insertYouTubeVideo = () => {
    const url = prompt('Enter YouTube video URL:')
    if (!url) return

    // Extract video ID from various YouTube URL formats
    let videoId = ''
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        videoId = match[1] || match[0]
        break
      }
    }

    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.')
      return
    }

    // Create iframe with YouTube embed
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube.com/embed/${videoId}`
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    iframe.allowFullscreen = true
    iframe.style.width = '100%'
    iframe.style.aspectRatio = '16 / 9'
    iframe.style.display = 'block'
    iframe.style.margin = '1rem 0'
    iframe.style.border = 'none'
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(iframe)
      // Move cursor after the iframe
      range.setStartAfter(iframe)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editorRef.current?.appendChild(iframe)
    }
    
    handleInput()
  }

  const insertYouTubeShort = () => {
    const url = prompt('Enter YouTube Short URL:')
    if (!url) return

    // Extract video ID from various YouTube URL formats (including shorts)
    let videoId = ''
    const patterns = [
      /(?:youtube\.com\/shorts\/|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        videoId = match[1] || match[0]
        break
      }
    }

    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube Short URL.')
      return
    }

    // Create iframe with YouTube embed for short (square format)
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube.com/embed/${videoId}`
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    iframe.allowFullscreen = true
    iframe.setAttribute('data-short', 'true')
    iframe.style.width = '100%'
    iframe.style.aspectRatio = '1 / 1'
    iframe.style.display = 'block'
    iframe.style.margin = '1rem 0'
    iframe.style.border = 'none'
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(iframe)
      // Move cursor after the iframe
      range.setStartAfter(iframe)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editorRef.current?.appendChild(iframe)
    }
    
    handleInput()
  }


  const Button = ({ onClick, icon: Icon, title, disabled, showLabel, label }: { onClick: (e?: React.MouseEvent) => void, icon: any, title: string, disabled?: boolean, showLabel?: boolean, label?: string }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className={`${showLabel ? 'px-3 py-2 flex items-center gap-2' : 'p-2'} hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      onMouseDown={(e) => {
        e.preventDefault()
        saveSelection()
      }}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      <Icon className="w-4 h-4" />
      {showLabel && <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{label || title}</span>}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden relative">
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 flex items-center gap-1 p-2 flex-wrap">
        <Button onClick={() => execCommand('bold')} icon={Bold} title="Make Text Bold (Ctrl+B)" />
        <Button onClick={() => execCommand('italic')} icon={Italic} title="Make Text Italic (Ctrl+I)" />
        <Button onClick={() => execCommand('underline')} icon={Underline} title="Underline Text (Ctrl+U)" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button onClick={() => execCommand('justifyLeft')} icon={AlignLeft} title="Align Text to Left" />
        <Button onClick={() => execCommand('justifyCenter')} icon={AlignCenter} title="Center Align Text" />
        <Button onClick={() => execCommand('justifyRight')} icon={AlignRight} title="Align Text to Right" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button 
          onClick={() => {
            if (!editorRef.current) return
            
            const saved = savedSelectionRef.current
            if (!saved || !saved.text.trim()) {
              // No saved selection or no text, just create list at cursor
              editorRef.current.focus()
              document.execCommand('insertUnorderedList', false)
              handleInput()
              return
            }
            
            // Create list from saved selection text
            const lines = saved.text.split(/\r?\n/).filter(line => line.trim())
            
            if (lines.length === 0) {
              editorRef.current.focus()
              document.execCommand('insertUnorderedList', false)
              handleInput()
              return
            }
            
            // Restore the saved range
            const selection = window.getSelection()
            if (selection) {
              try {
                selection.removeAllRanges()
                selection.addRange(saved.range)
                
                // Create list elements
                const ul = document.createElement('ul')
                lines.forEach(line => {
                  if (line.trim()) {
                    const li = document.createElement('li')
                    li.textContent = line.trim()
                    ul.appendChild(li)
                  }
                })
                
                // Delete selected content and insert list
                saved.range.deleteContents()
                saved.range.insertNode(ul)
                
                // Move cursor after list
                const newRange = document.createRange()
                newRange.setStartAfter(ul)
                newRange.collapse(true)
                selection.removeAllRanges()
                selection.addRange(newRange)
                
                editorRef.current.focus()
                handleInput()
              } catch (err) {
                // Fallback: use execCommand
                editorRef.current.focus()
                document.execCommand('insertUnorderedList', false)
                handleInput()
              }
            }
          }} 
          icon={List} 
          title="Create Bullet List" 
        />
        <Button 
          onClick={() => {
            if (!editorRef.current) return
            
            const saved = savedSelectionRef.current
            if (!saved || !saved.text.trim()) {
              // No saved selection or no text, just create list at cursor
              editorRef.current.focus()
              document.execCommand('insertOrderedList', false)
              handleInput()
              return
            }
            
            // Create list from saved selection text
            const lines = saved.text.split(/\r?\n/).filter(line => line.trim())
            
            if (lines.length === 0) {
              editorRef.current.focus()
              document.execCommand('insertOrderedList', false)
              handleInput()
              return
            }
            
            // Restore the saved range
            const selection = window.getSelection()
            if (selection) {
              try {
                selection.removeAllRanges()
                selection.addRange(saved.range)
                
                // Create list elements
                const ol = document.createElement('ol')
                lines.forEach(line => {
                  if (line.trim()) {
                    const li = document.createElement('li')
                    li.textContent = line.trim()
                    ol.appendChild(li)
                  }
                })
                
                // Delete selected content and insert list
                saved.range.deleteContents()
                saved.range.insertNode(ol)
                
                // Move cursor after list
                const newRange = document.createRange()
                newRange.setStartAfter(ol)
                newRange.collapse(true)
                selection.removeAllRanges()
                selection.addRange(newRange)
                
                editorRef.current.focus()
                handleInput()
              } catch (err) {
                // Fallback: use execCommand
                editorRef.current.focus()
                document.execCommand('insertOrderedList', false)
                handleInput()
              }
            }
          }} 
          icon={ListOrdered} 
          title="Create Numbered List" 
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button onClick={insertImage} icon={ImageIcon} title="Insert Image from URL" />
        <Button onClick={insertYouTubeVideo} icon={Video} title="Insert YouTube Video (16:9 Format)" showLabel={true} label="Video (16:9)" />
        <Button onClick={insertYouTubeShort} icon={Video} title="Insert YouTube Short (Square 1:1 Format)" showLabel={true} label="Short (1:1)" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`rich-text-editor min-h-[300px] max-h-[600px] overflow-y-auto p-4 focus:outline-none ${isFocused ? 'ring-2 ring-[#FFC72C]' : ''}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        .rich-text-editor {
          font-size: 1rem !important;
          line-height: 1.5 !important;
        }
        .rich-text-editor[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .rich-text-editor p {
          margin: 0.75rem 0 !important;
          font-size: 1rem !important;
          line-height: 1.5 !important;
        }
        .rich-text-editor p:first-child {
          margin-top: 0 !important;
        }
        .rich-text-editor p:last-child {
          margin-bottom: 0 !important;
        }
        .rich-text-editor br {
          display: block !important;
          content: "" !important;
          margin: 0.5rem 0 !important;
        }
        .rich-text-editor div {
          font-size: 1rem !important;
          line-height: 1.5 !important;
        }
        .rich-text-editor span {
          font-size: inherit !important;
          line-height: inherit !important;
        }
        .rich-text-editor strong,
        .rich-text-editor b {
          font-weight: 700 !important;
        }
        .rich-text-editor em,
        .rich-text-editor i {
          font-style: italic !important;
        }
        .rich-text-editor u {
          text-decoration: underline !important;
        }
        .rich-text-editor h1,
        .rich-text-editor h2,
        .rich-text-editor h3,
        .rich-text-editor h4,
        .rich-text-editor h5,
        .rich-text-editor h6 {
          margin: 1rem 0 0.75rem 0 !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
        }
        .rich-text-editor h1 {
          font-size: 1.75rem !important;
        }
        .rich-text-editor h2 {
          font-size: 1.5rem !important;
        }
        .rich-text-editor h3 {
          font-size: 1.25rem !important;
        }
        .rich-text-editor h4,
        .rich-text-editor h5,
        .rich-text-editor h6 {
          font-size: 1.125rem !important;
        }
        .rich-text-editor img {
          width: 100% !important;
          aspect-ratio: 16 / 9 !important;
          object-fit: cover !important;
          display: block !important;
          margin: 1rem 0 !important;
        }
        .rich-text-editor iframe {
          width: 100% !important;
          aspect-ratio: 16 / 9 !important;
          display: block !important;
          margin: 1rem 0 !important;
          border: none !important;
        }
        .rich-text-editor iframe[data-short="true"] {
          aspect-ratio: 1 / 1 !important;
        }
        .rich-text-editor ul,
        .rich-text-editor ol {
          margin: 1rem 0 !important;
          padding-left: 2rem !important;
          list-style-position: outside !important;
          display: block !important;
        }
        .rich-text-editor ul {
          list-style-type: disc !important;
          -webkit-padding-start: 2rem !important;
          padding-inline-start: 2rem !important;
        }
        .rich-text-editor ul li {
          list-style-type: disc !important;
          display: list-item !important;
          font-size: 1rem !important;
          line-height: 1.5 !important;
        }
        .rich-text-editor ul li::before {
          content: "" !important;
        }
        .rich-text-editor ol {
          list-style-type: decimal !important;
          -webkit-padding-start: 2rem !important;
          padding-inline-start: 2rem !important;
        }
        .rich-text-editor ol li {
          list-style-type: decimal !important;
          display: list-item !important;
          font-size: 1rem !important;
          line-height: 1.5 !important;
        }
        .rich-text-editor li {
          margin: 0.5rem 0 !important;
          display: list-item !important;
          list-style-position: outside !important;
          padding-left: 0.5rem !important;
        }
      `}</style>
    </div>
  )
}

