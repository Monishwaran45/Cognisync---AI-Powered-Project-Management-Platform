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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Settings, Trash2, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  name: string
  description: string
  status: string
  priority: string
  visibility: string
  riskLevel: string
  startDate: string
  endDate: string
  progress: number
  budget: number
  spent: number
  notifications: {
    emailUpdates: boolean
    deadlineReminders: boolean
    riskAlerts: boolean
  }
  integrations: {
    github: boolean
    jira: boolean
    slack: boolean
    calendar: boolean
  }
  goals: string[]
  tasks: any[]
  team: any[]
}

interface ProjectSettingsDialogProps {
  project: Project
  onUpdate: (project: Project) => void
  onDelete: () => void
  children?: React.ReactNode
}

export function ProjectSettingsDialog({ project, onUpdate, onDelete, children }: ProjectSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [formData, setFormData] = useState(project)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update project")

      const updatedProject = await response.json()
      onUpdate(updatedProject)
      setOpen(false)
      toast({
        title: "Success",
        description: "Project settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteConfirm !== project.name) {
      toast({
        title: "Error",
        description: "Please type the project name exactly to confirm deletion",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")

      onDelete()
      setOpen(false)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>Manage your project configuration and preferences</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate ? new Date(formData.startDate) : undefined}
                      onSelect={(date) => setFormData({ ...formData, startDate: date?.toISOString() || "" })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(new Date(formData.endDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate ? new Date(formData.endDate) : undefined}
                      onSelect={(date) => setFormData({ ...formData, endDate: date?.toISOString() || "" })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress Override (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spent">Amount Spent ($)</Label>
                <Input
                  id="spent"
                  type="number"
                  value={formData.spent}
                  onChange={(e) => setFormData({ ...formData, spent: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-medium">${(formData.budget - formData.spent).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization:</span>
                    <span className="font-medium">
                      {formData.budget > 0 ? Math.round((formData.spent / formData.budget) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for project updates</p>
                </div>
                <Switch
                  checked={formData.notifications.emailUpdates}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, emailUpdates: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deadline Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified before task deadlines</p>
                </div>
                <Switch
                  checked={formData.notifications.deadlineReminders}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, deadlineReminders: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Risk Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts when project risks are detected</p>
                </div>
                <Switch
                  checked={formData.notifications.riskAlerts}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, riskAlerts: checked },
                    })
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Integrations</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>GitHub</Label>
                  <Switch
                    checked={formData.integrations.github}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        integrations: { ...formData.integrations, github: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Jira</Label>
                  <Switch
                    checked={formData.integrations.jira}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        integrations: { ...formData.integrations, jira: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Slack</Label>
                  <Switch
                    checked={formData.integrations.slack}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        integrations: { ...formData.integrations, slack: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Calendar</Label>
                  <Switch
                    checked={formData.integrations.calendar}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        integrations: { ...formData.integrations, calendar: checked },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="danger" className="space-y-4">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-confirm">Type "{project.name}" to confirm deletion</Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder={project.name}
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteConfirm !== project.name || loading}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project Permanently
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
