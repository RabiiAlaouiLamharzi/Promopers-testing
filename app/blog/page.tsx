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
        <BlogListingSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </main>
      <Footer />
    </div>
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
      <section ref={sectionRef} className="luxury-section bg-white">
        <div className="luxury-container">
          <div className="text-[#121830] py-20">Loading blog articles...</div>
        </div>
      </section>
    )
  }

  if (allBlogPosts.length === 0) {
    return (
      <section ref={sectionRef} className="luxury-section bg-white">
        <div className="luxury-container">
          <div className="text-[#121830] py-20">No blog articles found.</div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="luxury-section bg-white">
      <div className="luxury-container">

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2 cursor-pointer">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/70 via-[#121830]/20 to-transparent" />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121830] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                        <Tag className="w-3 h-3 text-[#FFCE5C]" />
                        {t(`works.category${post.category === "POS Activation" ? "PosActivation" : post.category === "Events" ? "Events" : "Merchandising"}`) || post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-[#121830] mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-[#121830] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
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
          <div className="flex items-center justify-center gap-6 mt-16">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentPage === 1
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#121830] text-[#121830] hover:bg-[#121830] hover:text-white"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentPage === page ? "bg-[#121830] w-6" : "bg-gray-200 w-3"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentPage === totalPages
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-[#121830] text-[#121830] hover:bg-[#121830] hover:text-white"
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

