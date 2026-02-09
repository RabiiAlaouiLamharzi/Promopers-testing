"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Save, Trash2, Edit, Plus, X, Upload, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { getRoleDisplayLabel } from "@/lib/team-role-display"
import type { TeamMember } from "@/lib/teams"

export default function AdminTeamPage() {
  const [activeTab, setActiveTab] = useState<'office' | 'consultant' | 'field'>('office')
  const [officeTeam, setOfficeTeam] = useState<TeamMember[]>([])
  const [consultants, setConsultants] = useState<TeamMember[]>([])
  const [fieldForce, setFieldForce] = useState<TeamMember[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    roleKey: 'projectManager',
    image: '/new-images/logo.png',
    funImage: '/new-images/logo.png',
    linkedin: '#',
    order: 0,
    type: 'office'
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/team')
      const data = await response.json()
      setOfficeTeam(data.officeTeam?.sort((a: TeamMember, b: TeamMember) => a.order - b.order) || [])
      setConsultants(data.experienceConsultants?.sort((a: TeamMember, b: TeamMember) => a.order - b.order) || [])
      setFieldForce(data.fieldForce?.sort((a: TeamMember, b: TeamMember) => a.order - b.order) || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching teams:', error)
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, type: 'image' | 'funImage') => {
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/team/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFormData({ ...formData, [type]: data.url })
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      roleKey: 'projectManager',
      image: '/new-images/logo.png',
      funImage: '/new-images/logo.png',
      linkedin: '#',
      order: 0,
      type: activeTab
    })
    setEditingMember(null)
    setIsCreating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData = {
        action: editingMember ? 'update' : 'create',
        ...formData,
        type: activeTab,
        ...(editingMember && { id: editingMember.id })
      }
      // Remove xing if it exists (for backward compatibility)
      delete (submitData as any).xing

      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      toast({
        title: "Success",
        description: editingMember ? "Team member updated successfully" : "Team member created successfully"
      })

      resetForm()
      fetchTeams()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save team member",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return
    }

    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      toast({
        title: "Success",
        description: "Team member deleted successfully"
      })

      fetchTeams()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (member: TeamMember) => {
    const roleDisplayLabel = getRoleDisplayLabel(member.roleKey, t, language)
    setFormData({
      name: member.name,
      roleKey: roleDisplayLabel,
      image: member.image,
      funImage: member.funImage,
      linkedin: member.linkedin,
      order: member.order,
      type: member.type
    })
    setEditingMember(member)
    setIsCreating(true)
  }

  const handleReorder = async (memberIds: string[]) => {
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          memberIds,
          type: activeTab
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reorder')
      }

      fetchTeams()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder team members",
        variant: "destructive"
      })
    }
  }

  const currentTeam = activeTab === 'office' ? officeTeam : activeTab === 'field' ? fieldForce : consultants

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-7xl" style={{ marginTop: '120px' }}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-black text-[#002855] uppercase">Team Management</h1>
            <button
              onClick={() => {
                resetForm()
                setIsCreating(true)
              }}
              className="bg-[#FFC72C] text-[#002855] px-6 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Team Member
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('office')
                resetForm()
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'office'
                  ? 'text-[#002855] border-b-2 border-[#FFC72C]'
                  : 'text-gray-500 hover:text-[#002855]'
              }`}
            >
              Office Team ({officeTeam.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('field')
                resetForm()
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'field'
                  ? 'text-[#002855] border-b-2 border-[#FFC72C]'
                  : 'text-gray-500 hover:text-[#002855]'
              }`}
            >
              Field Force ({fieldForce.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('consultant')
                resetForm()
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'consultant'
                  ? 'text-[#002855] border-b-2 border-[#FFC72C]'
                  : 'text-gray-500 hover:text-[#002855]'
              }`}
            >
              Experience Consultants ({consultants.length})
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#002855]">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.roleKey}
                    onChange={(e) => setFormData({ ...formData, roleKey: e.target.value })}
                    placeholder="e.g. Project Manager, Co-CEO Finance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/new-images/member.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                      required
                    />
                    <label className="bg-[#FFC72C] text-[#002855] px-4 py-2 rounded-lg font-bold hover:bg-[#E6B526] transition-colors cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, 'image')
                        }}
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <img src={formData.image} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fun Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.funImage}
                      onChange={(e) => setFormData({ ...formData, funImage: e.target.value })}
                      placeholder="/new-images/member-funny.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                      required
                    />
                    <label className="bg-[#FFC72C] text-[#002855] px-4 py-2 rounded-lg font-bold hover:bg-[#E6B526] transition-colors cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, 'funImage')
                        }}
                      />
                    </label>
                  </div>
                  {formData.funImage && (
                    <img src={formData.funImage} alt="Fun" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order (for sorting)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-[#FFC72C] text-[#002855] px-6 py-3 rounded-full font-bold hover:bg-[#E6B526] transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingMember ? 'Update' : 'Create'} Team Member
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentTeam.map((member, index) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-[#002855] to-[#003D7A]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/new-images/logo.png'
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4 text-[#002855]" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="bg-red-500/90 hover:bg-red-500 p-2 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#002855] mb-1">{member.name}</h3>
                  <p className="text-sm text-[#003D7A]">
                    {getRoleDisplayLabel(member.roleKey, t, language)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">Order: {member.order}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTeam.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No {activeTab === 'office' ? 'office team' : activeTab === 'field' ? 'field force' : 'consultants'} members yet. Click "Add Team Member" to get started.
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

