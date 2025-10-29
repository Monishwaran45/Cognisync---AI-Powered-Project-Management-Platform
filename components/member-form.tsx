"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

export interface MemberFormData {
  name: string
  email: string
  role: string
  department: string
  skills: string[]
  hourlyRate: string
  capacity: string
  availability?: string
  bio: string
}

interface MemberFormProps {
  initialData: MemberFormData
  onFormChange: (data: MemberFormData) => void
}

export function MemberForm({ initialData, onFormChange }: MemberFormProps) {
  const [newSkill, setNewSkill] = useState("")

  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    onFormChange({ ...initialData, [field]: value })
  }

  const addSkill = () => {
    if (newSkill.trim() && !initialData.skills.includes(newSkill.trim())) {
      onFormChange({ ...initialData, skills: [...initialData.skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onFormChange({ ...initialData, skills: initialData.skills.filter((skill) => skill !== skillToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={initialData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={initialData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john@company.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select value={initialData.role} onValueChange={(value) => handleInputChange("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
              <SelectItem value="Backend Developer">Backend Developer</SelectItem>
              <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
              <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
              <SelectItem value="Product Manager">Product Manager</SelectItem>
              <SelectItem value="QA Engineer">QA Engineer</SelectItem>
              <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
              <SelectItem value="Data Scientist">Data Scientist</SelectItem>
              <SelectItem value="Project Manager">Project Manager</SelectItem>
              <SelectItem value="Business Analyst">Business Analyst</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={initialData.department} onValueChange={(value) => handleInputChange("department", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <div className="flex space-x-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill (e.g., React, Python, Figma)"
          />
          <Button type="button" onClick={addSkill} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {initialData.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={initialData.hourlyRate}
            onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
            placeholder="75"
            min="0"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Weekly Capacity (hours)</Label>
          <Input
            id="capacity"
            type="number"
            value={initialData.capacity}
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            placeholder="40"
            min="1"
            max="80"
          />
        </div>
        {initialData.availability !== undefined && (
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select value={initialData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio / Notes</Label>
        <Textarea
          id="bio"
          value={initialData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Brief description about the team member..."
          rows={3}
        />
      </div>
    </div>
  )
}