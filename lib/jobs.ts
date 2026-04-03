import { readJobs, writeJobs } from './jsonbin-storage'

export interface JobTranslations {
  fr?: { title?: string; type?: string; department?: string; description?: string; requirements?: string[] }
  de?: { title?: string; type?: string; department?: string; description?: string; requirements?: string[] }
  it?: { title?: string; type?: string; department?: string; description?: string; requirements?: string[] }
}

export interface Job {
  id: string
  title: string
  type: string
  department: string
  description: string
  requirements: string[]
  order: number
  published: boolean
  createdAt: string
  updatedAt: string
  translations?: JobTranslations
}

export async function getAllJobs(): Promise<Job[]> {
  try {
    return await readJobs<Job[]>()
  } catch {
    return []
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  const jobs = await getAllJobs()
  return jobs.find(j => j.id === id) || null
}

export async function saveJobs(jobs: Job[]): Promise<void> {
  await writeJobs(jobs)
}

export async function createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
  const jobs = await getAllJobs()
  const now = new Date().toISOString()
  const newJob: Job = { ...job, id: `job-${Date.now()}`, createdAt: now, updatedAt: now }
  jobs.push(newJob)
  await saveJobs(jobs)
  return newJob
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  const jobs = await getAllJobs()
  const index = jobs.findIndex(j => j.id === id)
  if (index === -1) return null
  jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() }
  await saveJobs(jobs)
  return jobs[index]
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await getAllJobs()
  const filtered = jobs.filter(j => j.id !== id)
  if (filtered.length === jobs.length) return false
  await saveJobs(filtered)
  return true
}
