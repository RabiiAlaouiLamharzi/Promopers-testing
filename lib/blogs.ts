import path from 'path'
import { readBlogs, writeBlogs } from './jsonbin-storage'

const LOCAL_FILE = path.join(process.cwd(), 'data', 'blogs.json')

export interface BlogTranslations {
  fr?: {
    title?: string
    content?: string | string[]
  }
  de?: {
    title?: string
    content?: string | string[]
  }
  it?: {
    title?: string
    content?: string | string[]
  }
}

export interface Blog {
  id: string
  slug: string
  title: string
  author: string
  date: string
  category: string
  image: string
  content: string[] // Array of content paragraphs or HTML string
  published: boolean
  createdAt: string
  updatedAt: string
  translations?: BlogTranslations
}

export async function getAllBlogs(): Promise<Blog[]> {
  try {
    return await readBlogs<Blog[]>()
  } catch (error) {
    console.error('Error reading blogs:', error)
    return []
  }
}

export async function getBlogBySlug(slug: string, includeUnpublished: boolean = false): Promise<Blog | null> {
  const blogs = await getAllBlogs()
  if (includeUnpublished) {
    return blogs.find(blog => blog.slug === slug) || null
  }
  return blogs.find(blog => blog.slug === slug && blog.published) || null
}

export async function saveBlogs(blogs: Blog[]): Promise<void> {
  try {
    await writeBlogs(blogs)
    console.log(`[Blogs] Saved ${blogs.length} blogs to JSONBin.io`)
  } catch (error) {
    console.error('Error saving blogs:', error)
    throw new Error('Failed to save blogs')
  }
}

export async function createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  const blogs = await getAllBlogs()
  const id = blog.slug
  const now = new Date().toISOString()
  
  const newBlog: Blog = {
    ...blog,
    id,
    createdAt: now,
    updatedAt: now
  }
  
  blogs.push(newBlog)
  await saveBlogs(blogs)
  
  // Verify the write by reading back immediately
  const verifyBlogs = await getAllBlogs()
  const savedBlog = verifyBlogs.find(b => b.slug === blog.slug)
  
  if (!savedBlog) {
    console.error('Failed to verify blog was saved. Expected blogs count:', blogs.length, 'Found:', verifyBlogs.length)
    throw new Error('Blog was not saved successfully. Please try again.')
  }
  
  return newBlog
}

export async function updateBlog(slug: string, updates: Partial<Blog>): Promise<Blog | null> {
  const blogs = await getAllBlogs()
  const index = blogs.findIndex(blog => blog.slug === slug)
  
  if (index === -1) return null
  
  blogs[index] = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveBlogs(blogs)
  return blogs[index]
}

export async function deleteBlog(slug: string): Promise<boolean> {
  const blogs = await getAllBlogs()
  const filtered = blogs.filter(blog => blog.slug !== slug)
  
  if (filtered.length === blogs.length) return false
  
  await saveBlogs(filtered)
  return true
}

