import path from 'path'
import { readJsonFromBin, writeJsonToBin } from './jsonbin-storage'
import fs from 'fs'

const LOCAL_FILE = path.join(process.cwd(), 'data', 'teams.json')
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY
const TEAMS_BIN_ID = process.env.JSONBIN_TEAMS_BIN_ID || 'default-teams'

export interface TeamMember {
  id: string
  name: string
  roleKey: string
  image: string
  funImage: string
  linkedin: string
  order: number
  type: 'office' | 'consultant'
  createdAt: string
  updatedAt: string
}

export interface TeamData {
  officeTeam: TeamMember[]
  experienceConsultants: TeamMember[]
  updatedAt: string
}

async function readTeamsFromBin(): Promise<TeamData | null> {
  try {
    if (JSONBIN_API_KEY) {
      const data = await readJsonFromBin<TeamData>(TEAMS_BIN_ID)
      if (data) {
        console.log('[Teams] Loaded from JSONBin')
        return data
      }
    }
  } catch (error) {
    console.warn('[Teams] JSONBin failed, trying local file:', error)
  }
  
  // Fallback to local file
  if (fs.existsSync(LOCAL_FILE)) {
    const fileContent = fs.readFileSync(LOCAL_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    console.log('[Teams] Loaded from local file')
    return data
  }
  
  return null
}

async function writeTeamsToBin(data: TeamData): Promise<void> {
  try {
    // Save to local file only in development (Vercel has read-only filesystem)
    if (process.env.NODE_ENV === 'development') {
      try {
        const dir = path.dirname(LOCAL_FILE)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2))
        console.log(`[Teams] Saved to local file`)
      } catch (error) {
        console.warn('[Teams] Failed to save to local file (this is normal on Vercel):', error)
      }
    }
    
    // Always try to save to JSONBin if configured (required for production/Vercel)
    if (JSONBIN_API_KEY) {
      try {
        await writeJsonToBin(TEAMS_BIN_ID, data)
        console.log(`[Teams] Saved to JSONBin.io`)
      } catch (error) {
        console.error('[Teams] Failed to save to JSONBin:', error)
        // If we're in production and JSONBin fails, throw error
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
          throw new Error(`Failed to save teams to JSONBin: ${error instanceof Error ? error.message : String(error)}`)
        }
        // In development, just warn if local file was saved
        throw new Error(`Failed to save teams. JSONBin error: ${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      // In production/Vercel, JSONBin is required
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        throw new Error('JSONBIN_API_KEY is required for saving teams in production. Please set it in Vercel environment variables.')
      }
      // In development, warn but allow local file save
      console.warn('[Teams] JSONBIN_API_KEY not configured. Teams will only be saved locally.')
    }
  } catch (error) {
    console.error('Error saving teams:', error)
    throw error instanceof Error ? error : new Error('Failed to save teams')
  }
}

export async function getTeamData(): Promise<TeamData> {
  const data = await readTeamsFromBin()
  
  if (data) {
    return data
  }
  
  // Return default empty structure
  return {
    officeTeam: [],
    experienceConsultants: [],
    updatedAt: new Date().toISOString()
  }
}

export async function saveTeamData(teamData: TeamData): Promise<void> {
  teamData.updatedAt = new Date().toISOString()
  await writeTeamsToBin(teamData)
}

export async function getOfficeTeam(): Promise<TeamMember[]> {
  const data = await getTeamData()
  return data.officeTeam.sort((a, b) => a.order - b.order)
}

export async function getExperienceConsultants(): Promise<TeamMember[]> {
  const data = await getTeamData()
  return data.experienceConsultants.sort((a, b) => a.order - b.order)
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
  const data = await getTeamData()
  const id = `team-${Date.now()}`
  const now = new Date().toISOString()
  
  const newMember: TeamMember = {
    ...member,
    id,
    createdAt: now,
    updatedAt: now
  }
  
  if (member.type === 'office') {
    data.officeTeam.push(newMember)
  } else {
    data.experienceConsultants.push(newMember)
  }
  
  await saveTeamData(data)
  return newMember
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
  const data = await getTeamData()
  let member: TeamMember | null = null
  let memberIndex = -1
  let teamArray: TeamMember[] | null = null
  
  // Find member in office team
  memberIndex = data.officeTeam.findIndex(m => m.id === id)
  if (memberIndex !== -1) {
    teamArray = data.officeTeam
    member = data.officeTeam[memberIndex]
  } else {
    // Find in consultants
    memberIndex = data.experienceConsultants.findIndex(m => m.id === id)
    if (memberIndex !== -1) {
      teamArray = data.experienceConsultants
      member = data.experienceConsultants[memberIndex]
    }
  }
  
  if (!member || !teamArray || memberIndex === -1) {
    return null
  }
  
  teamArray[memberIndex] = {
    ...member,
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveTeamData(data)
  return teamArray[memberIndex]
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const data = await getTeamData()
  let found = false
  
  // Try office team
  const officeIndex = data.officeTeam.findIndex(m => m.id === id)
  if (officeIndex !== -1) {
    data.officeTeam.splice(officeIndex, 1)
    found = true
  } else {
    // Try consultants
    const consultantIndex = data.experienceConsultants.findIndex(m => m.id === id)
    if (consultantIndex !== -1) {
      data.experienceConsultants.splice(consultantIndex, 1)
      found = true
    }
  }
  
  if (found) {
    await saveTeamData(data)
  }
  
  return found
}

export async function reorderTeamMembers(memberIds: string[], type: 'office' | 'consultant'): Promise<void> {
  const data = await getTeamData()
  const teamArray = type === 'office' ? data.officeTeam : data.experienceConsultants
  
  memberIds.forEach((id, index) => {
    const member = teamArray.find(m => m.id === id)
    if (member) {
      member.order = index
    }
  })
  
  await saveTeamData(data)
}

