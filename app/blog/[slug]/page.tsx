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
          <div className="text-center text-[#121830]">Loading...</div>
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
            <h1 className="text-4xl font-bold text-[#121830] mb-4">{t("blog.articleNotFound")}</h1>
            <Link href="/blog" className="text-[#FFCE5C] hover:underline">
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
      <ArticleTitleSection data={articleData} />
      <ContentSection data={articleData} allBlogs={allBlogs} currentSlug={slug || ""} />
      <RelatedBlogsSection allBlogs={allBlogs} currentSlug={slug || ""} />
      <Footer />
    </div>
  )
}


function ArticleTitleSection({ data }: { data: any }) {
  const { t } = useLanguage()

  return (
    <section className="luxury-section bg-white">
      <div className="luxury-container">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#2B2F36]/60 hover:text-[#121830] transition-colors mb-10 group">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          {t("blog.backToBlog")}
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121830] text-white text-xs font-bold rounded-full uppercase tracking-wide">
            <Tag className="w-3 h-3 text-[#FFCE5C]" />
            {t(`works.category${data.category === "POS Activation" ? "PosActivation" : data.category === "Events" ? "Events" : "Merchandising"}`) || data.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {data.date}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <User className="w-3.5 h-3.5" />
            {data.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#121830] uppercase max-w-4xl leading-none tracking-tight mb-4">
          {data.title}
        </h1>
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
    <section id="content-section" className="pb-8 bg-white">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">

          {/* Main Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}>
            {/* Featured Image */}
            <div className="relative h-[480px] rounded-3xl overflow-hidden mb-12 shadow-xl">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {Array.isArray(data.content) && data.content.length > 0 ? (
                data.content.map((contentItem: string, index: number) => {
                  if (contentItem.includes('<')) {
                    return (
                      <div
                        key={index}
                        className="text-base text-[#2B2F36] leading-relaxed rich-text-content mb-6"
                        dangerouslySetInnerHTML={{ __html: contentItem }}
                      />
                    )
                  } else {
                    return (
                      <p key={index} className="text-base text-[#2B2F36] leading-relaxed mb-6">
                        {contentItem}
                      </p>
                    )
                  }
                })
              ) : (
                <p className="text-base text-[#2B2F36] leading-relaxed">
                  {typeof data.content === 'string' ? data.content : ''}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`transition-all duration-1000 sticky top-24 space-y-8 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`} style={{ transitionDelay: "200ms" }}>

            {/* Search */}
            <div className="relative search-container">
              <h3 className="text-sm font-bold text-[#121830] uppercase tracking-widest mb-4">{t("blog.search")}</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("blog.searchFor")}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchPopup(true) }}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-[#121830] outline-none transition-colors text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {showSearchPopup && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-72 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        href={`/blog/${result.slug}`}
                        className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
                        onClick={() => { setShowSearchPopup(false); setSearchQuery("") }}
                      >
                        <div className="font-semibold text-[#121830] text-sm mb-0.5">{result.title}</div>
                        <div className="text-xs text-gray-400">{result.date}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Recent Posts */}
            <div>
              <h3 className="text-sm font-bold text-[#121830] uppercase tracking-widest mb-4">{t("blog.recentPosts")}</h3>
              <ul className="space-y-5">
                {recentPosts.map((post, index) => (
                  <li key={index}>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <h4 className="text-sm font-medium text-[#2B2F36] group-hover:text-[#121830] transition-colors leading-snug mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-400">{post.date}</p>
                    </Link>
                  </li>
                ))}
              </ul>
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
      const firstContent = Array.isArray(translated.content) && translated.content.length > 0
        ? translated.content[0].replace(/<[^>]*>/g, '').trim()
        : ''
      const excerpt = firstContent.length > 120 ? firstContent.substring(0, 120) + '...' : firstContent
      return {
        ...blog,
        title: translated.title,
        image: blog.image,
        excerpt
      }
    })

  if (relatedBlogs.length === 0) return null

  return (
    <section className="pt-12 pb-8 bg-white">
      <div className="luxury-container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <h2 className="text-headline text-[#121830] mb-4 uppercase">{t("blog.relatedBlogsAndNews")}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {relatedBlogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/70 via-[#121830]/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121830] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      <Tag className="w-3 h-3 text-[#FFCE5C]" />
                      {t(`works.category${blog.category === "POS Activation" ? "PosActivation" : blog.category === "Events" ? "Events" : "Merchandising"}`) || blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex-grow flex flex-col">
                  <h3 className="text-base font-bold text-[#121830] mb-2 leading-tight">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{blog.date}</span>
                    <div className="inline-flex items-center gap-1.5 text-[#121830] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                      {t("blog.readMore")}
                      <ArrowRight className="w-4 h-4" />
                    </div>
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

