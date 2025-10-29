"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Plus,
  ArrowLeft,
  Star,
  BarChart3,
  Network,
} from "lucide-react"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { ProjectSettingsDialog } from "@/components/project-settings-dialog"
import { ProjectAnalyticsDashboard } from "@/components/project-analytics-dashboard"
import { DependencyGraph } from "@/components/dependency-graph"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  dependencies: string[]
  estimatedHours: number
  actualHours: number
  tags: string[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  skills: string[]
  workload: number
}

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
  tasks: Task[]
  team: TeamMember[]
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch project")
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject)
  }

  const handleProjectDelete = () => {
    router.push("/dashboard")
  }

  const handleTaskAdd = async (taskData: any) => {
    try {
      const response = await fetch(`/api/projects/${params.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error("Failed to add task")
      await fetchProject() // Refresh project data
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-gray-100 text-gray-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const completedTasks = project.tasks?.filter((task) => task.status === "completed").length || 0
  const totalTasks = project.tasks?.length || 0
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <Badge className={getStatusColor(project.status || "planning")}>{project.status || "Planning"}</Badge>
                  <Badge className={getPriorityColor(project.priority || "medium")}>
                    {project.priority || "Medium"} Priority
                  </Badge>
                  <Badge className={getRiskColor(project.riskLevel || "low")}>{project.riskLevel || "Low"} Risk</Badge>
                </div>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Star
              </Button>
              <ProjectSettingsDialog project={project} onUpdate={handleProjectUpdate} onDelete={handleProjectDelete} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.progress || 0}%</div>
                  <Progress value={project.progress || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {completedTasks}/{totalTasks}
                  </div>
                  <p className="text-xs text-muted-foreground">{taskProgress.toFixed(0)}% completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(project.spent || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">of ${(project.budget || 0).toLocaleString()} budget</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.team?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">active members</p>
                </CardContent>
              </Card>
            </div>

            {/* Project Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Project Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.goals?.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{goal}</span>
                    </div>
                  )) || <p className="text-gray-500">No goals defined yet.</p>}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Project created</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Team members added</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <AddTaskDialog onTaskAdd={handleTaskAdd} teamMembers={project.team || []} />
            </div>

            <div className="grid gap-4">
              {project.tasks?.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge className={getTaskStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                          <Badge variant="outline">{task.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                          <span>Assigned to: {task.assignee}</span>
                          <span>{task.estimatedHours}h estimated</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No tasks created yet.</p>
                    <AddTaskDialog onTaskAdd={handleTaskAdd} teamMembers={project.team || []} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="grid gap-4">
              {project.team?.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Workload: {member.workload}%</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.skills?.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No team members added yet.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Member
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Start Date:</span>
                    <span className="text-sm">
                      {project.startDate ? format(new Date(project.startDate), "PPP") : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">End Date:</span>
                    <span className="text-sm">
                      {project.endDate ? format(new Date(project.endDate), "PPP") : "Not set"}
                    </span>
                  </div>
                  <Progress value={project.progress || 0} className="mt-4" />
                  <p className="text-xs text-gray-500 text-center">{project.progress || 0}% complete</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Project Analytics</h2>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
            <ProjectAnalyticsDashboard project={project} />
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Task Dependencies</h2>
              <Button variant="outline">
                <Network className="h-4 w-4 mr-2" />
                Auto-Layout
              </Button>
            </div>
            <DependencyGraph tasks={project.tasks || []} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  AI Insights
                </CardTitle>
                <CardDescription>AI-powered analysis and recommendations for your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Project Health</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your project is on track with good progress and team engagement.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Recommendations</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Consider adding more detailed task descriptions</li>
                      <li>• Schedule regular team check-ins</li>
                      <li>• Review budget allocation for upcoming milestones</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
