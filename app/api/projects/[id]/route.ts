import { type NextRequest, NextResponse } from "next/server"

// Mock project data
const mockProject = {
  id: "1",
  name: "E-Commerce Platform Redesign",
  description: "Complete overhaul of the existing e-commerce platform with modern UI/UX and enhanced performance",
  status: "active",
  priority: "high",
  visibility: "team",
  riskLevel: "medium",
  startDate: "2024-01-15T00:00:00.000Z",
  endDate: "2024-06-30T00:00:00.000Z",
  progress: 65,
  budget: 150000,
  spent: 87500,
  notifications: {
    emailUpdates: true,
    deadlineReminders: true,
    riskAlerts: true,
  },
  integrations: {
    github: true,
    jira: true,
    slack: false,
    calendar: true,
  },
  goals: [
    "Improve user experience and conversion rates",
    "Implement modern responsive design",
    "Optimize performance and loading times",
    "Integrate advanced analytics and reporting",
    "Enhance security and payment processing",
  ],
  tasks: [
    {
      id: "task-1",
      title: "User Research & Analysis",
      description: "Conduct comprehensive user research to understand current pain points and requirements",
      status: "completed",
      priority: "high",
      assignee: "Sarah Chen",
      dueDate: "2024-02-15T00:00:00.000Z",
      dependencies: [],
      estimatedHours: 40,
      actualHours: 38,
      tags: ["research", "ux"],
    },
    {
      id: "task-2",
      title: "Design System Creation",
      description: "Develop a comprehensive design system with components, colors, and typography",
      status: "completed",
      priority: "high",
      assignee: "Alex Rivera",
      dueDate: "2024-03-01T00:00:00.000Z",
      dependencies: ["task-1"],
      estimatedHours: 60,
      actualHours: 65,
      tags: ["design", "ui"],
    },
    {
      id: "task-3",
      title: "Frontend Development",
      description: "Implement the new design using React and modern frontend technologies",
      status: "in-progress",
      priority: "high",
      assignee: "Mike Johnson",
      dueDate: "2024-05-15T00:00:00.000Z",
      dependencies: ["task-2"],
      estimatedHours: 120,
      actualHours: 85,
      tags: ["development", "frontend"],
    },
    {
      id: "task-4",
      title: "Backend API Development",
      description: "Develop robust APIs to support the new frontend functionality",
      status: "in-progress",
      priority: "medium",
      assignee: "Emma Davis",
      dueDate: "2024-05-01T00:00:00.000Z",
      dependencies: ["task-1"],
      estimatedHours: 100,
      actualHours: 45,
      tags: ["development", "backend"],
    },
    {
      id: "task-5",
      title: "Performance Optimization",
      description: "Optimize application performance and implement caching strategies",
      status: "todo",
      priority: "medium",
      assignee: "David Kim",
      dueDate: "2024-06-01T00:00:00.000Z",
      dependencies: ["task-3", "task-4"],
      estimatedHours: 40,
      actualHours: 0,
      tags: ["optimization", "performance"],
    },
    {
      id: "task-6",
      title: "Testing & QA",
      description: "Comprehensive testing including unit, integration, and user acceptance testing",
      status: "todo",
      priority: "high",
      assignee: "Lisa Wang",
      dueDate: "2024-06-15T00:00:00.000Z",
      dependencies: ["task-3", "task-4"],
      estimatedHours: 80,
      actualHours: 0,
      tags: ["testing", "qa"],
    },
  ],
  team: [
    {
      id: "member-1",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["UX Design", "User Research", "Prototyping", "Figma"],
      workload: 85,
    },
    {
      id: "member-2",
      name: "Alex Rivera",
      email: "alex.rivera@company.com",
      role: "UI Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["UI Design", "Design Systems", "Figma", "Adobe Creative Suite"],
      workload: 75,
    },
    {
      id: "member-3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "TypeScript", "CSS", "JavaScript"],
      workload: 90,
    },
    {
      id: "member-4",
      name: "Emma Davis",
      email: "emma.davis@company.com",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
      workload: 70,
    },
    {
      id: "member-5",
      name: "David Kim",
      email: "david.kim@company.com",
      role: "DevOps Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      workload: 60,
    },
    {
      id: "member-6",
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      role: "QA Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Test Automation", "Selenium", "Jest", "Cypress"],
      workload: 55,
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, you would fetch from database
    if (id === "1") {
      return NextResponse.json(mockProject)
    }

    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    // In a real app, you would update the database
    const updatedProject = { ...mockProject, ...updates }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, you would delete from database
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
