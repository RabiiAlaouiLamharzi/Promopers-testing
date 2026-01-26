import { Blog, BlogTranslations } from './blogs'
import { Language } from './i18n'

/**
 * Get translated content for a blog article
 * Priority: 1. Blog's stored translations, 2. English fallback
 */
export function getTranslatedBlog(
  blog: Blog,
  language: Language
): Blog {
  // English is the base language, no translation needed
  if (language === 'en') {
    return blog
  }

  const blogTranslations = blog.translations?.[language]
  if (!blogTranslations) {
    return blog // No translation found, return English
  }

  // Build translated blog from stored translations
  // Handle content: translations store as string, but Blog interface expects string[]
  let translatedContent: string[] = blog.content
  if (blogTranslations.content) {
    if (typeof blogTranslations.content === 'string') {
      translatedContent = [blogTranslations.content]
    } else if (Array.isArray(blogTranslations.content)) {
      translatedContent = blogTranslations.content
    }
  }

  const translated: Blog = {
    ...blog,
    title: blogTranslations.title || blog.title,
    content: translatedContent,
  }

  return translated
}

