"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useEdit } from "@/contexts/edit-context"
import { EditableText } from "@/components/editable-text"

interface ArticleCardProps {
  blog: {
    title: string
    image: string
    categoryKey: string
    size: string
    slug?: string
  }
  delay: string
  isVisible: boolean
  className?: string
  editMode?: boolean
}

function ArticleCard({ blog, delay, isVisible, className = "", editMode = false }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      ref={cardRef}
      className={`group transition-all duration-1000 ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative rounded-2xl overflow-hidden h-96 md:h-[600px]">
        <img
          src={blog.image || "/placeholder.svg"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        
        {/* Original content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white z-40">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 inline-block">
            <span className="text-xs font-semibold uppercase tracking-wider">{t(`works.${blog.categoryKey}`)}</span>
          </div>
          <p className="text-lg font-bold leading-tight">{blog.title}</p>
        </div>
      </div>
    </div>
  )
}

function SmallArticleCard({ blog, delay, isVisible, editMode = false }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      ref={cardRef}
      className={`group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative rounded-2xl overflow-hidden h-[290px]">
        <img
          src={blog.image || "/placeholder.svg"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        
        {/* Original content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 text-white z-40">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3 inline-block">
            <span className="text-xs font-semibold uppercase tracking-wider">{t(`works.${blog.categoryKey}`)}</span>
          </div>
          <p className="text-sm font-bold leading-tight">{blog.title}</p>
        </div>
      </div>
    </div>
  )
}

// Helper function to get translated blog title
function getTranslatedBlogTitle(slug: string, t: (key: string) => string) {
  const slugToKey: Record<string, string> = {
    'peace-tea-pos-activation-2025': 'peaceTea',
    'jbl-popup-geneva-airport': 'jblPopup',
    'samsung-galaxy-launch': 'samsungGalaxy',
    'coca-cola-taco-truck-tour': 'cocaColaTaco',
    'sunice-2025-festival': 'sunice2025',
    'vitaminwater-promotion-zurich': 'vitaminwater'
  }
  
  const articleKey = slugToKey[slug] || slug
  const titleKey = `blog.${articleKey}.title`
  const translatedTitle = t(titleKey)
  
  return translatedTitle && translatedTitle !== titleKey && translatedTitle.trim() !== '' 
    ? translatedTitle 
    : null
}

export function WorksSectionEditable() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language, revision } = useLanguage()
  const { editMode } = useEdit()

  const [title, setTitle] = useState(t("works.title"))
  const [subtitle, setSubtitle] = useState(t("works.subtitle"))
  const [description, setDescription] = useState(t("works.description"))
  const [readAllPostsText, setReadAllPostsText] = useState(t("works.readAllPosts"))

  // Update translations when language changes
  useEffect(() => {
    setTitle(t("works.title"))
    setSubtitle(t("works.subtitle"))
    setDescription(t("works.description"))
    setReadAllPostsText(t("works.readAllPosts"))
  }, [t, language, revision])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const blogs = [
    {
      title: "Peace Tea POS activation 2025 – Digital meets Physical",
      image: "https://promopers.com/wp-content/uploads/2025/08/1753878889830.jpg",
      categoryKey: "categoryPosActivation",
      size: "lg",
      slug: "peace-tea-pos-activation-2025"
    },
    {
      title: "JBL Popup Geneva Airport – Sound experience with Harman & promoPers",
      image: "https://promopers.com/wp-content/uploads/2025/08/1752224462121.jpg",
      categoryKey: "categoryEvents",
      size: "sm",
      slug: "jbl-popup-geneva-airport"
    },
    {
      title: "Galaxy Z Fold7 & Flip7 Switzerland rollout – Samsung launch at the POS",
      image: "https://promopers.com/wp-content/uploads/2025/08/1752071990876.jpg",
      categoryKey: "categoryMerchandising",
      size: "sm",
      slug: "samsung-galaxy-launch"
    },
    {
      title: "Coca-Cola & Old El Paso Taco Truck Tour – Free Fajitas at Coop",
      image: "https://promopers.com/wp-content/uploads/2025/08/1745932595777.jpg",
      categoryKey: "categoryEvents",
      size: "sm",
      slug: "coca-cola-taco-truck-tour"
    },
    {
      title: "SUNICE 2025 – Festival atmosphere meets strong brand presence",
      image: "https://promopers.com/wp-content/uploads/2025/08/1745401675246.jpg",
      categoryKey: "categoryEvents",
      size: "sm",
      slug: "sunice-2025-festival"
    }
  ].map(blog => ({
    ...blog,
    title: getTranslatedBlogTitle(blog.slug, t) || blog.title
  }))

  return (
    <section ref={sectionRef} className="bg-white pt-0 pb-0 mt-16 md:mt-24">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-20 items-start mb-16">
          {/* Left: Title */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <h2 className="text-headline text-[#002855] mb-4 uppercase">
              <EditableText
                value={title}
                onChange={setTitle}
                translationKey="works.title"
                editMode={editMode}
                className="text-headline text-[#002855] uppercase"
              />
            </h2>
            <h3 className="text-subheadline text-[#003D7A] mb-8 uppercase">
              <EditableText
                value={subtitle}
                onChange={setSubtitle}
                translationKey="works.subtitle"
                editMode={editMode}
                className="text-subheadline text-[#003D7A] uppercase"
              />
            </h3>
          </div>

          {/* Right: Description & CTA */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-luxury-body text-[#003D7A] leading-relaxed mb-6 max-w-md">
              <EditableText
                value={description}
                onChange={setDescription}
                translationKey="works.description"
                editMode={editMode}
                multiline
                as="span"
                className="text-luxury-body text-[#003D7A] leading-relaxed"
              />
            </p>
            <Link 
              href="/blog" 
              onClick={(e) => {
                if (editMode) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
              className="luxury-button luxury-button-primary"
            >
              <span className="font-semibold">
                <EditableText
                  value={readAllPostsText}
                  onChange={setReadAllPostsText}
                  translationKey="works.readAllPosts"
                  editMode={editMode}
                  className="font-semibold"
                />
              </span>
              <span className="text-[#002855] font-bold text-xl ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Blog Post - Left Side */}
          <ArticleCard
            blog={blogs[0]}
            delay="0ms"
            isVisible={isVisible}
            className="md:col-span-2 md:row-span-2"
            editMode={editMode}
          />

          {/* Top Right */}
          <SmallArticleCard
            blog={blogs[1]}
            delay="100ms"
            isVisible={isVisible}
            editMode={editMode}
          />

          {/* Bottom Left */}
          <SmallArticleCard
            blog={blogs[2]}
            delay="200ms"
            isVisible={isVisible}
            editMode={editMode}
          />

          {/* Middle Bottom */}
          <SmallArticleCard
            blog={blogs[3]}
            delay="300ms"
            isVisible={isVisible}
            editMode={editMode}
          />

          {/* Bottom Right */}
          <SmallArticleCard
            blog={blogs[4]}
            delay="400ms"
            isVisible={isVisible}
            editMode={editMode}
          />
        </div>
      </div>
    </section>
  )
}

