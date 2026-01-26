"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedBlog } from "@/lib/blog-translations"
import type { Blog } from "@/lib/blogs"

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <BlogListingSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <CTASection />
      </main>
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
      {/* Subtle Luxury Pattern */}
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

function BlogListingSection({ currentPage, setCurrentPage }: { currentPage: number, setCurrentPage: (page: number) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog')
      if (response.ok) {
        const data: Blog[] = await response.json()
        setBlogs(data.filter(blog => blog.published))
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get excerpt from content
  const getExcerpt = (blog: Blog): string => {
    if (Array.isArray(blog.content) && blog.content.length > 0) {
      const firstContent = blog.content[0]
      // Remove HTML tags for excerpt
      const text = firstContent.replace(/<[^>]*>/g, '').trim()
      return text.length > 150 ? text.substring(0, 150) + '...' : text
    }
    return ''
  }

  const allBlogPosts = blogs.map(blog => {
    const translated = getTranslatedBlog(blog, language)
    return {
      title: translated.title,
      slug: blog.slug,
      category: blog.category,
      date: blog.date,
      image: blog.image,
      excerpt: getExcerpt(translated)
    }
  })

  const itemsPerPage = 6
  const totalPages = Math.ceil(allBlogPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const blogPosts = allBlogPosts.slice(startIndex, endIndex)

  if (loading) {
    return (
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="luxury-container">
          <div className="text-center text-[#002855] py-20">Loading blog articles...</div>
        </div>
      </section>
    )
  }

  if (allBlogPosts.length === 0) {
    return (
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="luxury-container">
          <div className="text-center text-[#002855] py-20">No blog articles found.</div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="luxury-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2 cursor-pointer">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/60 to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#002855] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                        <Tag className="w-3.5 h-3.5 text-[#FFC72C]" />
                        {t(`works.category${post.category === "POS Activation" ? "PosActivation" : post.category === "Events" ? "Events" : "Merchandising"}`) || post.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-[#002855] mb-4 leading-tight group-hover:text-[#FFC72C] transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{t("blog.date")}: {post.date}</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-2 text-[#FFC72C] font-bold group-hover:gap-3 transition-all">
                        {t("blog.readMore")}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                currentPage === 1
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#FFC72C] text-[#FFC72C] hover:bg-[#FFC72C] hover:text-[#002855]"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-[#FFC72C] text-[#002855] shadow-lg shadow-[#FFC72C]/30"
                      : "border-2 border-gray-300 text-gray-600 hover:border-[#FFC72C] hover:text-[#FFC72C]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#FFC72C] text-[#FFC72C] hover:bg-[#FFC72C] hover:text-[#002855]"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
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
