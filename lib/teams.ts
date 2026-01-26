import path from 'path'
import { readJsonFromBin, writeJsonToBin } from './jsonbin-storage'
import fs from 'fs'

const LOCAL_FILE = path.join(process.cwd(), 'data', 'teams.json')
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY
// Use the actual bin ID if provided, otherwise use the bin name to find it
const TEAMS_BIN_ID = process.env.JSONBIN_TEAMS_BIN_ID || 'website-changes-teams'

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
      let actualBinId = TEAMS_BIN_ID
      let data: any = null
      
      // Check if TEAMS_BIN_ID looks like a bin ID (hex string) or a name
      const isBinIdFormat = /^[a-f0-9]{24}$/i.test(TEAMS_BIN_ID)
      
      if (isBinIdFormat) {
        // It's a bin ID, try to read it directly
        try {
          const url = `https://api.jsonbin.io/v3/b/${TEAMS_BIN_ID}/latest`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
            },
          })
          
          if (response.ok) {
            const jsonData = await response.json()
            data = jsonData.record
          }
        } catch (error) {
          console.warn('[Teams] Failed to read bin by ID:', error)
        }
      } else {
        // It's a bin name, search for it
        const foundId = await findBinByName(TEAMS_BIN_ID)
        if (foundId) {
          actualBinId = foundId
          try {
            const url = `https://api.jsonbin.io/v3/b/${foundId}/latest`
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
              },
            })
            
            if (response.ok) {
              const jsonData = await response.json()
              data = jsonData.record
            }
          } catch (error) {
            console.warn('[Teams] Failed to read bin by found ID:', error)
          }
        }
      }
      
      // Validate that data is a proper TeamData object (not an array)
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Ensure it has the proper structure
        const teamData: TeamData = {
          officeTeam: Array.isArray(data.officeTeam) ? data.officeTeam : [],
          experienceConsultants: Array.isArray(data.experienceConsultants) ? data.experienceConsultants : [],
          updatedAt: data.updatedAt || new Date().toISOString()
        }
        console.log(`[Teams] Loaded from JSONBin (${teamData.officeTeam.length} office, ${teamData.experienceConsultants.length} consultants)`)
        return teamData
      } else if (data) {
        console.warn('[Teams] JSONBin returned invalid data structure (array or missing properties)')
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
      if (data && typeof data === 'object' && !Array.isArray(data)) {
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

async function findBinByName(binName: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY!,
      },
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    const bins = Array.isArray(data.record) ? data.record : (data.record ? [data.record] : [])
    
    const matchingBin = bins.find((b: any) => {
      const binNameLower = binName.toLowerCase()
      const bName = (b.name || '').toLowerCase()
      return bName === binNameLower || bName.includes(binNameLower)
    })
    
    return matchingBin ? matchingBin.id : null
  } catch (error) {
    console.warn('[Teams] Failed to search for bin by name:', error)
    return null
  }
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
    
    // Always save to JSONBin if configured (required for production/Vercel)
    if (JSONBIN_API_KEY) {
      try {
        let actualBinId = TEAMS_BIN_ID
        let binExists = false
        
        // First, try to find the bin by ID or name
        // Check if TEAMS_BIN_ID looks like a bin ID (hex string) or a name
        const isBinIdFormat = /^[a-f0-9]{24}$/i.test(TEAMS_BIN_ID)
        
        if (isBinIdFormat) {
          // It's a bin ID, try to read it
          const readUrl = `https://api.jsonbin.io/v3/b/${TEAMS_BIN_ID}/latest`
          const readResponse = await fetch(readUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
            },
          })
          
          if (readResponse.ok) {
            binExists = true
            actualBinId = TEAMS_BIN_ID
          }
        } else {
          // It's a bin name, search for it
          const foundId = await findBinByName(TEAMS_BIN_ID)
          if (foundId) {
            binExists = true
            actualBinId = foundId
            console.log(`[Teams] Found bin by name "${TEAMS_BIN_ID}": ${actualBinId}`)
          }
        }
        
        // Now write to the bin
        if (binExists) {
          // Update existing bin
          const url = `https://api.jsonbin.io/v3/b/${actualBinId}`
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(data),
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`JSONBin API error: ${response.status} ${response.statusText} - ${errorText}`)
          }
          
          console.log(`[Teams] Updated JSONBin.io bin: ${actualBinId} (${data.officeTeam.length} office, ${data.experienceConsultants.length} consultants)`)
        } else {
          // Bin doesn't exist, create it with the proper initial structure
          console.log(`[Teams] Bin not found, creating new bin: ${TEAMS_BIN_ID}`)
          
          // Ensure data has the correct structure before creating
          const initialData: TeamData = {
            officeTeam: Array.isArray(data.officeTeam) ? data.officeTeam : [],
            experienceConsultants: Array.isArray(data.experienceConsultants) ? data.experienceConsultants : [],
            updatedAt: data.updatedAt || new Date().toISOString()
          }
          
          const createResponse = await fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
              'X-Bin-Name': 'website-changes-teams',
            },
            body: JSON.stringify(initialData),
          })
          
          if (!createResponse.ok) {
            const errorText = await createResponse.text()
            throw new Error(`JSONBin API error: ${createResponse.status} ${createResponse.statusText} - ${errorText}`)
          }
          
          const result = await createResponse.json()
          actualBinId = result.metadata?.id || TEAMS_BIN_ID
          console.log(`[Teams] Created new bin: ${actualBinId}`)
          
          // Log the bin ID for future use
          if (result.metadata?.id) {
            console.log(`[Teams] ✅ Bin created! Set JSONBIN_TEAMS_BIN_ID=${result.metadata.id} in Vercel for faster lookups`)
          }
        }
      } catch (error) {
        console.error('[Teams] Failed to save to JSONBin:', error)
        // In production/Vercel, JSONBin is required
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
          throw new Error(`Failed to save teams to JSONBin: ${error instanceof Error ? error.message : String(error)}`)
        }
        throw error
      }
    } else {
      // In production/Vercel, JSONBin is required
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        throw new Error('JSONBIN_API_KEY is required for saving teams in production. Please set it in Vercel environment variables.')
      }
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
  
  // Validate data structure
  if (!data || !Array.isArray(data.officeTeam) || !Array.isArray(data.experienceConsultants)) {
    console.error('[Teams] Invalid data structure in updateTeamMember')
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
  
  // Validate data structure
  if (!data || !Array.isArray(data.officeTeam) || !Array.isArray(data.experienceConsultants)) {
    console.error('[Teams] Invalid data structure in deleteTeamMember')
    throw new Error('Invalid team data structure. Please ensure JSONBin has the correct data format.')
  }
  
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

