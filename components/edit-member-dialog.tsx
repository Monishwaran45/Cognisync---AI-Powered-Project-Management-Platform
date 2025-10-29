"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { MemberForm, type MemberFormData } from "./member-form"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  skills: string[]
  hourlyRate: number
  capacity: number
  currentWorkload: number
  utilization: number
  availability: "available" | "busy" | "unavailable"
  joinedAt: string
  bio?: string
}

interface EditMemberDialogProps {
  member: TeamMember
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateMember: (member: TeamMember) => void
}

export function EditMemberDialog({ member, open, onOpenChange, onUpdateMember }: EditMemberDialogProps) {
  const [formData, setFormData] = useState<MemberFormData>({} as MemberFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        skills: [...member.skills],
        hourlyRate: member.hourlyRate.toString(),
        capacity: member.capacity.toString(),
        availability: member.availability,
        bio: member.bio || "",
      })
    }
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields: Name, Email, and Role.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updatedMember: TeamMember = {
        ...member,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        skills: formData.skills,
        hourlyRate: Number.parseFloat(formData.hourlyRate) || 0,
        capacity: Number.parseInt(formData.capacity) || 40,
        availability: formData.availability as TeamMember["availability"],
        bio: formData.bio,
        // Recalculate utilization
        utilization: Math.round((member.currentWorkload / Number.parseInt(formData.capacity || "40")) * 100),
      }

      await onUpdateMember(updatedMember)
      onOpenChange(false)
      toast({
        title: "Success",
        description: "Team member updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update member:", error)
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>Update team member information and settings.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {formData.name && <MemberForm initialData={formData} onFormChange={setFormData} />}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
