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
      // Validate that data is a proper TeamData object (not an array or invalid structure)
      if (data && typeof data === 'object' && !Array.isArray(data) && 
          ('officeTeam' in data || 'experienceConsultants' in data)) {
        // Ensure it has the proper structure
        const teamData: TeamData = {
          officeTeam: Array.isArray(data.officeTeam) ? data.officeTeam : [],
          experienceConsultants: Array.isArray(data.experienceConsultants) ? data.experienceConsultants : [],
          updatedAt: data.updatedAt || new Date().toISOString()
        }
        console.log('[Teams] Loaded from JSONBin')
        return teamData
      } else {
        console.warn('[Teams] JSONBin returned invalid data structure (array or missing properties), treating as empty')
      }
    }
  } catch (error) {
    console.warn('[Teams] JSONBin failed, trying local file:', error)
  }
  
  // Fallback to local file
  if (fs.existsSync(LOCAL_FILE)) {
    try {
      const fileContent = fs.readFileSync(LOCAL_FILE, 'utf8')
      const data = JSON.parse(fileContent)
      // Validate structure
      if (data && typeof data === 'object' && !Array.isArray(data) &&
          ('officeTeam' in data || 'experienceConsultants' in data)) {
        console.log('[Teams] Loaded from local file')
        return {
          officeTeam: Array.isArray(data.officeTeam) ? data.officeTeam : [],
          experienceConsultants: Array.isArray(data.experienceConsultants) ? data.experienceConsultants : [],
          updatedAt: data.updatedAt || new Date().toISOString()
        }
      }
    } catch (error) {
      console.warn('[Teams] Failed to parse local file:', error)
    }
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
  // Ensure data structure is valid before saving
  if (!teamData || typeof teamData !== 'object' || Array.isArray(teamData)) {
    throw new Error('Invalid team data: must be an object with officeTeam and experienceConsultants arrays')
  }
  
  // Ensure arrays exist and are arrays
  if (!Array.isArray(teamData.officeTeam)) {
    teamData.officeTeam = []
  }
  if (!Array.isArray(teamData.experienceConsultants)) {
    teamData.experienceConsultants = []
  }
  
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
  
  // Validate data structure
  if (!data || !Array.isArray(data.officeTeam) || !Array.isArray(data.experienceConsultants)) {
    console.error('[Teams] Invalid data structure in updateTeamMember:', {
      hasData: !!data,
      officeTeamType: Array.isArray(data?.officeTeam),
      consultantsType: Array.isArray(data?.experienceConsultants),
      dataKeys: data ? Object.keys(data) : 'no data'
    })
    throw new Error('Invalid team data structure. Please ensure JSONBin has the correct data format.')
  }
  
  let member: TeamMember | null = null
  let memberIndex = -1
  let teamArray: TeamMember[] | null = null
  
  // Find member in office team
  memberIndex = data.officeTeam.findIndex(m => m.id === id)
  if (memberIndex !== -1) {
    teamArray = data.officeTeam
    member = data.officeTeam[memberIndex]
    console.log(`[Teams] Found member in office team: ${id}`)
  } else {
    // Find in consultants
    memberIndex = data.experienceConsultants.findIndex(m => m.id === id)
    if (memberIndex !== -1) {
      teamArray = data.experienceConsultants
      member = data.experienceConsultants[memberIndex]
      console.log(`[Teams] Found member in consultants: ${id}`)
    }
  }
  
  if (!member || !teamArray || memberIndex === -1) {
    console.warn(`[Teams] Member not found for update: ${id}. Office team: ${data.officeTeam.length}, Consultants: ${data.experienceConsultants.length}`)
    return null
  }
  
  teamArray[memberIndex] = {
    ...member,
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveTeamData(data)
  console.log(`[Teams] Successfully updated member: ${id}`)
  return teamArray[memberIndex]
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const data = await getTeamData()
  
  // Validate data structure
  if (!data || !Array.isArray(data.officeTeam) || !Array.isArray(data.experienceConsultants)) {
    console.error('[Teams] Invalid data structure in deleteTeamMember:', {
      hasData: !!data,
      officeTeamType: Array.isArray(data?.officeTeam),
      consultantsType: Array.isArray(data?.experienceConsultants),
      dataKeys: data ? Object.keys(data) : 'no data'
    })
    throw new Error('Invalid team data structure. Please ensure JSONBin has the correct data format.')
  }
  
  let found = false
  
  // Try office team
  const officeIndex = data.officeTeam.findIndex(m => m.id === id)
  if (officeIndex !== -1) {
    data.officeTeam.splice(officeIndex, 1)
    found = true
    console.log(`[Teams] Deleted member from office team: ${id}`)
  } else {
    // Try consultants
    const consultantIndex = data.experienceConsultants.findIndex(m => m.id === id)
    if (consultantIndex !== -1) {
      data.experienceConsultants.splice(consultantIndex, 1)
      found = true
      console.log(`[Teams] Deleted member from consultants: ${id}`)
    }
  }
  
  if (found) {
    await saveTeamData(data)
    console.log(`[Teams] Successfully deleted member: ${id}`)
  } else {
    console.warn(`[Teams] Member not found for deletion: ${id}. Office team: ${data.officeTeam.length}, Consultants: ${data.experienceConsultants.length}`)
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

