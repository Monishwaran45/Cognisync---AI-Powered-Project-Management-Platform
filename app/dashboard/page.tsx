"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ProjectAnalyticsDashboard } from "@/components/project-analytics-dashboard"
import { DependencyGraph } from "@/components/dependency-graph"
import { ChatWidget } from "@/components/chat-widget"
import { DebugPanel } from "@/components/debug-panel"
import { Calendar, Users, DollarSign, AlertTriangle, TrendingUp, BarChart3, Network } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on-hold"
  progress: number
  dueDate: string
  budget: number
  spent: number
  teamSize: number
  riskLevel: "low" | "medium" | "high"
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeView, setActiveView] = useState<"overview" | "analytics" | "dependencies">("overview")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel?: string) => {
    if (!riskLevel) return "bg-gray-500"
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500"
    switch (status.toLowerCase()) {
      case "planning":
        return "bg-blue-500"
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-purple-500"
      case "on-hold":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                CogniSync
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/dashboard" className="text-white px-3 py-2 rounded-md text-sm font-medium bg-blue-600">
                Dashboard
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your projects with AI-powered insights</p>
          </div>
          <div className="flex gap-4">
            <CreateProjectDialog onProjectCreated={fetchProjects} />
            <DebugPanel />
          </div>
        </div>

        {/* View Toggle */}
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="data-[state=active]:bg-blue-600">
              <Network className="w-4 h-4 mr-2" />
              Dependencies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-gray-400">Active projects</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.reduce((sum, p) => sum + (p.teamSize || 0), 0)}</div>
                  <p className="text-xs text-gray-400">Across all projects</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
                  </div>
                  <p className="text-xs text-gray-400">Allocated budget</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.filter((p) => p.riskLevel === "high").length}</div>
                  <p className="text-xs text-gray-400">Projects need attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-black/20 border-white/10 text-white hover:bg-black/30 transition-colors"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">{project.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getRiskColor(project.riskLevel)} text-white`}>
                          {project.riskLevel?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                        <Badge className={`${getStatusColor(project.status)} text-white`}>
                          {project.status?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">
                          {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400">{project.teamSize || 0} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-400">
                          {formatCurrency(project.spent || 0)} / {formatCurrency(project.budget || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setSelectedProject(project)
                          setActiveView("analytics")
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => {
                          setSelectedProject(project)
                          setActiveView("dependencies")
                        }}
                      >
                        <Network className="w-4 h-4 mr-2" />
                        Graph
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {projects.length === 0 && (
              <Card className="bg-black/20 border-white/10 text-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-gray-400 text-center mb-4">
                    Create your first project to get started with AI-powered project management.
                  </p>
                  <CreateProjectDialog onProjectCreated={fetchProjects} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            {selectedProject ? (
              <ProjectAnalyticsDashboard projectId={selectedProject.id} />
            ) : (
              <Card className="bg-black/20 border-white/10 text-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a project</h3>
                  <p className="text-gray-400 text-center">
                    Choose a project from the overview to view detailed analytics.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dependencies">
            {selectedProject ? (
              <DependencyGraph projectId={selectedProject.id} />
            ) : (
              <Card className="bg-black/20 border-white/10 text-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Network className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a project</h3>
                  <p className="text-gray-400 text-center">
                    Choose a project from the overview to view dependency graphs.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ChatWidget />
    </div>
  )
}
