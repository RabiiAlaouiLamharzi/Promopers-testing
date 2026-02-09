import { NextRequest, NextResponse } from 'next/server'
import { 
  getTeamData, 
  getOfficeTeam, 
  getExperienceConsultants,
  getFieldForce,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  saveTeamData
} from '@/lib/teams'
import type { TeamMember } from '@/lib/teams'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as 'office' | 'consultant' | 'field' | null
    
    if (type === 'office') {
      const team = await getOfficeTeam()
      return NextResponse.json(team)
    } else if (type === 'consultant') {
      const consultants = await getExperienceConsultants()
      return NextResponse.json(consultants)
    } else if (type === 'field') {
      const fieldForce = await getFieldForce()
      return NextResponse.json(fieldForce)
    } else {
      // Return all team data
      const data = await getTeamData()
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('Error fetching team data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create') {
      const { name, roleKey, image, funImage, linkedin, type, order } = data

      if (!name || !roleKey || !type) {
        return NextResponse.json(
          { error: 'Name, roleKey, and type are required' },
          { status: 400 }
        )
      }

      const newMember = await createTeamMember({
        name,
        roleKey,
        image: image || '/new-images/logo.png',
        funImage: funImage || '/new-images/logo.png',
        linkedin: linkedin || '#',
        order: order ?? 0,
        type: type as 'office' | 'consultant' | 'field'
      })

      return NextResponse.json(newMember, { status: 201 })
    } else if (action === 'update') {
      const { id, ...updates } = data

      if (!id) {
        return NextResponse.json(
          { error: 'ID is required' },
          { status: 400 }
        )
      }

      const updated = await updateTeamMember(id, updates)
      if (!updated) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(updated)
    } else if (action === 'delete') {
      const { id } = data

      if (!id) {
        return NextResponse.json(
          { error: 'ID is required' },
          { status: 400 }
        )
      }

      const deleted = await deleteTeamMember(id)
      if (!deleted) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true })
    } else if (action === 'reorder') {
      const { memberIds, type } = data

      if (!memberIds || !Array.isArray(memberIds) || !type) {
        return NextResponse.json(
          { error: 'memberIds array and type are required' },
          { status: 400 }
        )
      }

      await reorderTeamMembers(memberIds, type as 'office' | 'consultant' | 'field')
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: create, update, delete, or reorder' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing team request:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
      },
      { status: 500 }
    )
  }
}

