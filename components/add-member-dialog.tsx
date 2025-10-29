"use client"

import type React from "react"
import { useState } from "react"
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

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (memberData: any) => void
}

const initialFormData: MemberFormData = {
  name: "",
  email: "",
  role: "",
  department: "",
  skills: [],
  hourlyRate: "",
  capacity: "40",
  bio: "",
}

export function AddMemberDialog({ open, onOpenChange, onAddMember }: AddMemberDialogProps) {
  const [formData, setFormData] = useState<MemberFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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
      await onAddMember({
        ...formData,
        hourlyRate: Number.parseFloat(formData.hourlyRate) || 0,
        capacity: Number.parseInt(formData.capacity) || 40,
        skills: formData.skills,
        availability: "available",
        joinedAt: new Date().toISOString(),
      })

      setFormData(initialFormData)
      onOpenChange(false)
      toast({
        title: "Success",
        description: "Team member added successfully.",
      })
    } catch (error) {
      console.error("Failed to add member:", error)
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
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
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>Add a new team member to the project. Fill in their details and skills.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <MemberForm initialData={formData} onFormChange={setFormData} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
