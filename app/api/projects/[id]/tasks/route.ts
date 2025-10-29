import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock tasks data
    const tasks = [
      {
        id: "task-1",
        title: "User Research & Analysis",
        description: "Conduct comprehensive user research to understand current pain points and requirements",
        status: "completed",
        priority: "high",
        assignee: "Sarah Chen",
        startDate: "2024-01-15T00:00:00.000Z",
        endDate: "2024-02-15T00:00:00.000Z",
        estimatedHours: 40,
        actualHours: 38,
        progress: 100,
        dependencies: [],
        teamId: "team-1",
      },
      {
        id: "task-2",
        title: "Design System Creation",
        description: "Develop a comprehensive design system with components, colors, and typography",
        status: "completed",
        priority: "high",
        assignee: "Alex Rivera",
        startDate: "2024-02-16T00:00:00.000Z",
        endDate: "2024-03-01T00:00:00.000Z",
        estimatedHours: 60,
        actualHours: 65,
        progress: 100,
        dependencies: ["task-1"],
        teamId: "team-1",
      },
      {
        id: "task-3",
        title: "Frontend Development",
        description: "Implement the new design using React and modern frontend technologies",
        status: "in_progress",
        priority: "high",
        assignee: "Mike Johnson",
        startDate: "2024-03-02T00:00:00.000Z",
        endDate: "2024-05-15T00:00:00.000Z",
        estimatedHours: 120,
        actualHours: 85,
        progress: 70,
        dependencies: ["task-2"],
        teamId: "team-1",
      },
      {
        id: "task-4",
        title: "Backend API Development",
        description: "Develop robust APIs to support the new frontend functionality",
        status: "in_progress",
        priority: "medium",
        assignee: "Emma Davis",
        startDate: "2024-02-20T00:00:00.000Z",
        endDate: "2024-05-01T00:00:00.000Z",
        estimatedHours: 100,
        actualHours: 45,
        progress: 45,
        dependencies: ["task-1"],
        teamId: "team-1",
      },
      {
        id: "task-5",
        title: "Performance Optimization",
        description: "Optimize application performance and implement caching strategies",
        status: "not_started",
        priority: "medium",
        assignee: "David Kim",
        startDate: "2024-05-16T00:00:00.000Z",
        endDate: "2024-06-01T00:00:00.000Z",
        estimatedHours: 40,
        actualHours: 0,
        progress: 0,
        dependencies: ["task-3", "task-4"],
        teamId: "team-1",
      },
      {
        id: "task-6",
        title: "Testing & QA",
        description: "Comprehensive testing including unit, integration, and user acceptance testing",
        status: "not_started",
        priority: "high",
        assignee: "Lisa Wang",
        startDate: "2024-05-20T00:00:00.000Z",
        endDate: "2024-06-15T00:00:00.000Z",
        estimatedHours: 80,
        actualHours: 0,
        progress: 0,
        dependencies: ["task-3", "task-4"],
        teamId: "team-1",
      },
    ]

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const taskData = await request.json()

    // In a real app, you would save to database
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      status: "not_started",
      progress: 0,
      actualHours: 0,
      teamId: id,
    }

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
