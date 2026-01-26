"use client"

import { useEffect, useState, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Calendar, User, Tag, Search } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedBlog } from "@/lib/blog-translations"
import type { Blog } from "@/lib/blogs"

export default function BlogArticlePage() {
  const params = useParams()
  const { t, language } = useLanguage()
  const slug = params?.slug as string | undefined
  const [articleData, setArticleData] = useState<any>(null)
  const [originalData, setOriginalData] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [allBlogs, setAllBlogs] = useState<Blog[]>([])

  useEffect(() => {
    if (slug) {
      fetchBlog()
      fetchAllBlogs()
    }
  }, [slug])

  useEffect(() => {
    if (originalData) {
      const translated = getTranslatedBlog(originalData, language)
      setArticleData(translated)
    }
  }, [language, originalData])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blog?slug=${slug}`)
      if (!response.ok) {
        setLoading(false)
        return
      }
      const data: Blog = await response.json()
      setOriginalData(data)
      const translated = getTranslatedBlog(data, language)
      setArticleData(translated)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blog:', error)
      setLoading(false)
    }
  }

  const fetchAllBlogs = async () => {
    try {
      const response = await fetch('/api/blog')
      if (response.ok) {
        const blogs: Blog[] = await response.json()
        setAllBlogs(blogs)
      }
    } catch (error) {
      console.error('Error fetching all blogs:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-[#002855]">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!articleData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#002855] mb-4">{t("blog.articleNotFound")}</h1>
            <Link href="/blog" className="text-[#FFC72C] hover:underline">
              {t("blog.backToBlog")}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ArticleTitleSection data={articleData} />
      <ContentSection data={articleData} allBlogs={allBlogs} currentSlug={slug || ""} />
      <RelatedBlogsSection allBlogs={allBlogs} currentSlug={slug || ""} />
      <CTASection />
      <Footer />
    </div>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFC72C]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 luxury-container text-center px-6">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-[#FFC72C] bg-white/5 mt-16">
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("blog.ourBlog")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">{t("blog.blog")}</span>
          </h1>
          
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
  )
}

function ArticleTitleSection({ data }: { data: any }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#002855] text-white text-sm font-bold rounded-full uppercase tracking-wide">
              <Tag className="w-4 h-4 text-[#FFC72C]" />
              {t(`works.category${data.category === "POS Activation" ? "PosActivation" : data.category === "Events" ? "Events" : "Merchandising"}`) || data.category}
            </span>
            <span className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              {data.date}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#002855] mb-4 text-center leading-tight">
            {data.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span>{t("blog.by")} {data.author}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContentSection({ data, allBlogs, currentSlug }: { data: any, allBlogs: Blog[], currentSlug: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const { t, language } = useLanguage()
  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim().length > 0) {
      const results = allBlogs
        .filter(blog => blog.slug !== currentSlug && blog.published)
        .map(blog => {
          const translated = getTranslatedBlog(blog, language)
          return {
            slug: blog.slug,
            title: translated.title,
            category: blog.category,
            date: blog.date
          }
        })
        .filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase())
        )
      setSearchResults(results)
      setShowSearchPopup(results.length > 0)
    } else {
      setSearchResults([])
      setShowSearchPopup(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("content-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.search-container')) {
        setShowSearchPopup(false)
      }
    }
    
    if (showSearchPopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearchPopup])

  // Get recent posts (3 most recent)
  const recentPosts = allBlogs
    .filter(blog => blog.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(blog => {
      const translated = getTranslatedBlog(blog, language)
      return {
        slug: blog.slug,
        title: translated.title,
        date: blog.date
      }
    })

  return (
    <section id="content-section" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#FFC72C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#002855]/5 rounded-full blur-3xl" />

      <div className="luxury-container relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className={`lg:col-span-2 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}>
            {/* Featured Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-10 shadow-xl">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/30 to-transparent" />
            </div>

            {/* Article Content - Handle HTML content */}
            <div className="prose prose-lg max-w-none">
              {Array.isArray(data.content) && data.content.length > 0 ? (
                data.content.map((contentItem: string, index: number) => {
                  // Check if it's HTML
                  if (contentItem.includes('<')) {
                    return (
                      <div
                        key={index}
                        className="text-lg text-[#003D7A] leading-relaxed rich-text-content mb-6"
                        dangerouslySetInnerHTML={{ __html: contentItem }}
                      />
                    )
                  } else {
                    return (
                      <p key={index} className="text-lg text-[#003D7A] leading-relaxed mb-6">
                        {contentItem}
                      </p>
                    )
                  }
                })
              ) : (
                <p className="text-lg text-[#003D7A] leading-relaxed">
                  {typeof data.content === 'string' ? data.content : ''}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:col-span-1 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`} style={{ transitionDelay: "200ms" }}>
            <div className="space-y-8 sticky top-24">
              {/* Search */}
              <div className="bg-gray-50 rounded-2xl p-6 relative search-container">
                <h3 className="text-xl font-bold text-[#002855] mb-4">{t("blog.search")}</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("blog.searchFor")}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowSearchPopup(true)
                    }}
                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-[#FFC72C] outline-none transition-colors"
                  />
                  <button 
                    onClick={() => {
                      if (searchQuery.trim().length > 0) {
                        handleSearch(searchQuery)
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFC72C] cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  
                  {/* Search Results Popup */}
                  {showSearchPopup && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <Link
                          key={index}
                          href={`/blog/${result.slug}`}
                          className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => {
                            setShowSearchPopup(false)
                            setSearchQuery("")
                          }}
                        >
                          <div className="font-semibold text-[#002855] mb-1">{result.title}</div>
                          <div className="text-sm text-gray-500">{result.category} • {result.date}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#002855] mb-4">{t("blog.recentPosts")}</h3>
                <ul className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <li key={index}>
                      <Link href={`/blog/${post.slug}`} className="group">
                        <h4 className="text-[#003D7A] group-hover:text-[#FFC72C] transition-colors font-medium mb-1 leading-tight">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-500">{t("blog.date")}: {post.date}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#002855] mb-4">{t("blog.tags")}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white border border-gray-200 text-[#003D7A] rounded-full text-sm hover:border-[#FFC72C] hover:text-[#FFC72C] transition-colors cursor-pointer">
                    {t("blog.activation")}
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 text-[#003D7A] rounded-full text-sm hover:border-[#FFC72C] hover:text-[#FFC72C] transition-colors cursor-pointer">
                    {t("blog.retail")}
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 text-[#003D7A] rounded-full text-sm hover:border-[#FFC72C] hover:text-[#FFC72C] transition-colors cursor-pointer">
                    {t("blog.events")}
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 text-[#003D7A] rounded-full text-sm hover:border-[#FFC72C] hover:text-[#FFC72C] transition-colors cursor-pointer">
                    {t("blog.marketing")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedBlogsSection({ allBlogs, currentSlug }: { allBlogs: Blog[], currentSlug: string }) {
  const { t, language } = useLanguage()
  
  const relatedBlogs = allBlogs
    .filter(blog => blog.slug !== currentSlug && blog.published)
    .slice(0, 3)
    .map(blog => {
      const translated = getTranslatedBlog(blog, language)
      return {
        ...blog,
        title: translated.title,
        image: blog.image
      }
    })

  if (relatedBlogs.length === 0) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="luxury-container">
        <h2 className="text-4xl md:text-5xl font-black text-[#002855] mb-4 uppercase text-center">
          {t("blog.relatedBlogsAndNews")}
        </h2>
        <div className="w-20 h-0.5 bg-[#FFC72C] mx-auto mb-12" />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {relatedBlogs.map((blog, index) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002855] text-white text-xs font-bold rounded-full">
                      <Tag className="w-3 h-3 text-[#FFC72C]" />
                      {t(`works.category${blog.category === "POS Activation" ? "PosActivation" : blog.category === "Events" ? "Events" : "Merchandising"}`) || blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#002855] mb-3 leading-tight">{blog.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t("blog.date")}: {blog.date}</p>
                  <div className="inline-flex items-center gap-2 text-[#FFC72C] font-bold hover:gap-3 transition-all">
                    {t("blog.readMore")}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className={`text-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } transition-all duration-1500`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            {t("contact.readyToWork")}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("contact.discussBrand")}
          </p>

          <Link href="/contact" className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors flex items-center gap-3 mx-auto inline-flex w-auto">
            {t("contact.scheduleCall")}
            <ArrowRight className="w-5 h-5 text-[#002855]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
