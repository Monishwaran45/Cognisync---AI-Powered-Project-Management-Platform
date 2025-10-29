"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditMemberDialog } from "./edit-member-dialog"

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
  avatar?: string
}

interface TeamMembersTableProps {
  projectId: string
}

export function TeamMembersTable({ projectId }: TeamMembersTableProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [projectId])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/team`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      } else {
        // Fallback data for demo
        setMembers([
          {
            id: "1",
            name: "Sarah Chen",
            email: "sarah.chen@company.com",
            role: "UI/UX Designer",
            department: "Design",
            skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
            hourlyRate: 85,
            capacity: 40,
            currentWorkload: 32,
            utilization: 80,
            availability: "available",
            joinedAt: "2024-01-15",
          },
          {
            id: "2",
            name: "Mike Johnson",
            email: "mike.johnson@company.com",
            role: "Backend Developer",
            department: "Engineering",
            skills: ["Node.js", "Python", "PostgreSQL", "Docker"],
            hourlyRate: 95,
            capacity: 40,
            currentWorkload: 38,
            utilization: 95,
            availability: "busy",
            joinedAt: "2024-01-10",
          },
          {
            id: "3",
            name: "Alex Rivera",
            email: "alex.rivera@company.com",
            role: "Frontend Developer",
            department: "Engineering",
            skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
            hourlyRate: 90,
            capacity: 40,
            currentWorkload: 24,
            utilization: 60,
            availability: "available",
            joinedAt: "2024-01-18",
          },
          {
            id: "4",
            name: "Emma Davis",
            email: "emma.davis@company.com",
            role: "QA Engineer",
            department: "Engineering",
            skills: ["Test Automation", "Cypress", "Jest", "Manual Testing"],
            hourlyRate: 75,
            capacity: 40,
            currentWorkload: 16,
            utilization: 40,
            availability: "available",
            joinedAt: "2024-01-20",
          },
          {
            id: "5",
            name: "David Kim",
            email: "david.kim@company.com",
            role: "Product Manager",
            department: "Product",
            skills: ["Product Strategy", "Agile", "Analytics", "Roadmapping"],
            hourlyRate: 100,
            capacity: 40,
            currentWorkload: 35,
            utilization: 88,
            availability: "busy",
            joinedAt: "2024-01-05",
          },
        ])
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
  }

  const handleUpdateMember = async (updatedMember: TeamMember) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/team/${updatedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMember),
      })

      if (response.ok) {
        setMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)))
      }
    } catch (error) {
      console.error("Failed to update member:", error)
      // Update locally for demo
      setMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)))
    }
    setEditingMember(null)
  }

  const handleDeleteMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/team/${memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMembers(prev => prev.filter(member => member.id !== memberId))
      }
    } catch (error) {
      console.error("Failed to delete member:", error)
      // Remove locally for demo
      setMembers(prev => prev.filter(member => member.id !== memberId))
    }
    setDeletingMember(null)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "unavailable":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  if (loading) {
    return <div className="text-center py-8">Loading team members...</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Workload</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{member.role}</div>
                    <div className="text-sm text-gray-500">{member.department}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {member.currentWorkload}h / {member.capacity}h
                    </div>
                    <Progress value={(member.currentWorkload / member.capacity) * 100} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${getUtilizationColor(member.utilization)}`}>
                    {member.utilization}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(member.availability)}`} />
                    <span className="capitalize text-sm">{member.availability}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMember(member)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`mailto:${member.email}`)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingMember(member)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdateMember={handleUpdateMember}
        />
      )}

      {deletingMember && (
        <AlertDialog open={!!deletingMember} onOpenChange={(open) => !open && setDeletingMember(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove <strong>{deletingMember.name}</strong> from the project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteMember(deletingMember.id)} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
