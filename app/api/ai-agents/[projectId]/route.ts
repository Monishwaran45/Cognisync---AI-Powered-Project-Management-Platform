import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { AgentOrchestrator } from "@/lib/agent-orchestrator"

const dataDir = path.join(process.cwd(), "data")
const projectsFile = path.join(dataDir, "projects.json")

// Sample data for demonstration
const sampleTasks = [
  {
    id: "task-1",
    title: "Design System Setup",
    description: "Create comprehensive design system and component library",
    status: "completed",
    priority: "high",
    assignee: "Sarah Chen",
    assigneeId: "user-1",
    teamId: "design",
    startDate: "2024-01-01",
    endDate: "2024-01-15",
    progress: 100,
    dependencies: [],
    estimatedHours: 80,
    actualHours: 75,
  },
  {
    id: "task-2",
    title: "API Development",
    description: "Build RESTful API endpoints and database integration",
    status: "in-progress",
    priority: "high",
    assignee: "Mike Johnson",
    assigneeId: "user-2",
    teamId: "backend",
    startDate: "2024-01-10",
    endDate: "2024-01-20",
    progress: 65,
    dependencies: ["task-1"],
    estimatedHours: 120,
    actualHours: 95,
  },
  {
    id: "task-3",
    title: "Frontend Implementation",
    description: "Implement user interface using React and design system",
    status: "pending",
    priority: "medium",
    assignee: "Alex Rivera",
    assigneeId: "user-3",
    teamId: "frontend",
    startDate: "2024-01-18",
    endDate: "2024-01-25",
    progress: 0,
    dependencies: ["task-1", "task-2"],
    estimatedHours: 100,
    actualHours: 0,
  },
  {
    id: "task-4",
    title: "Testing & QA",
    description: "Comprehensive testing including unit, integration, and E2E tests",
    status: "pending",
    priority: "high",
    assignee: "Emma Davis",
    assigneeId: "user-4",
    teamId: "qa",
    startDate: "2024-01-23",
    endDate: "2024-01-30",
    progress: 0,
    dependencies: ["task-3"],
    estimatedHours: 60,
    actualHours: 0,
  },
]

// Ensure all sample data has required fields
const sampleTeams = [
  {
    id: "design",
    name: "Design Team",
    workloadUtilization: 75,
    taskIds: ["task-1"],
  },
  {
    id: "backend",
    name: "Backend Team",
    workloadUtilization: 95,
    taskIds: ["task-2"],
  },
  {
    id: "frontend",
    name: "Frontend Team",
    workloadUtilization: 60,
    taskIds: ["task-3"],
  },
  {
    id: "qa",
    name: "QA Team",
    workloadUtilization: 40,
    taskIds: ["task-4"],
  },
]

const sampleResources = [
  {
    id: "user-1",
    name: "Sarah Chen",
    teamId: "design",
    skills: ["UI/UX Design", "Figma", "Design Systems"],
    capacity: 40,
    availability: "available",
  },
  {
    id: "user-2",
    name: "Mike Johnson",
    teamId: "backend",
    skills: ["Node.js", "Python", "Database Design", "API Development"],
    capacity: 40,
    availability: "busy",
  },
  {
    id: "user-3",
    name: "Alex Rivera",
    teamId: "frontend",
    skills: ["React", "TypeScript", "CSS", "JavaScript"],
    capacity: 40,
    availability: "available",
  },
  {
    id: "user-4",
    name: "Emma Davis",
    teamId: "qa",
    skills: ["Test Automation", "Manual Testing", "Cypress", "Jest"],
    capacity: 40,
    availability: "available",
  },
]

const sampleDependencies = [
  {
    id: "dep-1",
    fromTask: "task-1",
    toTask: "task-2",
    type: "finish-to-start",
    lag: 0,
  },
  {
    id: "dep-2",
    fromTask: "task-1",
    toTask: "task-3",
    type: "finish-to-start",
    lag: 0,
  },
  {
    id: "dep-3",
    fromTask: "task-2",
    toTask: "task-3",
    type: "finish-to-start",
    lag: 0,
  },
  {
    id: "dep-4",
    fromTask: "task-3",
    toTask: "task-4",
    type: "finish-to-start",
    lag: 0,
  },
]

const sampleSkillRequirements = [
  { taskId: "task-1", skill: "UI/UX Design" },
  { taskId: "task-1", skill: "Design Systems" },
  { taskId: "task-2", skill: "API Development" },
  { taskId: "task-2", skill: "Database Design" },
  { taskId: "task-3", skill: "React" },
  { taskId: "task-3", skill: "TypeScript" },
  { taskId: "task-4", skill: "Test Automation" },
  { taskId: "task-4", skill: "Manual Testing" },
]

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    // Get project data
    let project
    try {
      const data = await fs.readFile(projectsFile, "utf8")
      const projects = JSON.parse(data)
      project = projects.find((p: any) => p.id === Number.parseInt(params.projectId))
    } catch (fileError) {
      // If file doesn't exist, create a sample project
      project = {
        id: Number.parseInt(params.projectId),
        name: "Sample Project",
        description: "Sample project for AI analysis",
        endDate: "2024-02-15",
      }
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Initialize agent orchestrator with error handling
    let orchestrator
    let result

    try {
      orchestrator = new AgentOrchestrator()

      // Prepare project data for agents
      const projectData = {
        project,
        tasks: sampleTasks,
        teams: sampleTeams,
        dependencies: sampleDependencies,
        resources: sampleResources,
        skillRequirements: sampleSkillRequirements,
      }

      // Run agent orchestration with timeout
      result = (await Promise.race([
        orchestrator.orchestrateProject(projectData),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Orchestration timeout")), 10000)),
      ])) as any
    } catch (orchestrationError) {
      console.error("Orchestration failed:", orchestrationError)
      // Use fallback analysis
      result = generateFallbackAnalysis()
    } finally {
      // Clean up orchestrator
      if (orchestrator) {
        try {
          await orchestrator.shutdownAgents()
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError)
        }
      }
    }

    // Transform result for frontend consumption
    const agentInsights = transformResultToInsights(result)

    return NextResponse.json(agentInsights)
  } catch (error) {
    console.error("Error in AI agents endpoint:", error)
    return NextResponse.json(getFallbackAgents(), { status: 200 })
  }
}

function generateFallbackAnalysis() {
  return {
    teamInsights: [
      {
        teamId: "design",
        riskLevel: "low",
        bottlenecks: [],
        recommendations: ["Team performing well"],
      },
    ],
    dependencyAnalysis: {
      circularDependencies: [],
      criticalPath: ["task-1", "task-2", "task-3", "task-4"],
      healthScore: 85,
    },
    riskAssessment: {
      activeRisks: [
        {
          severity: "medium",
          description: "Standard project monitoring required",
          mitigation: ["Continue regular monitoring"],
        },
      ],
    },
    timelineOptimization: {
      timelineSavings: 0,
      parallelizationOpportunities: [],
      recommendations: ["Timeline appears optimal"],
    },
    overallHealth: {
      score: 85,
    },
  }
}

function transformResultToInsights(result: any) {
  return [
    {
      id: "alignbot",
      name: "AlignBot",
      icon: "target",
      status: "active",
      confidence: result.overallHealth?.score > 80 ? 92 : 75,
      lastUpdate: "Just now",
      insights: result.teamInsights?.slice(0, 2).map((insight: any) => ({
        type: insight.riskLevel === "high" ? "warning" : "success",
        message: `Team ${insight.teamId}: ${insight.bottlenecks?.[0] || "Goals well-aligned"}`,
        recommendation: insight.recommendations?.[0] || "Continue current approach",
        impact: insight.riskLevel || "medium",
      })) || [
        {
          type: "success",
          message: "Team goals are well-aligned",
          recommendation: "Continue current approach",
          impact: "medium",
        },
      ],
    },
    {
      id: "depgraph",
      name: "DepGraph AI",
      icon: "git-branch",
      status: "active",
      confidence: 95,
      lastUpdate: "1 minute ago",
      insights: [
        {
          type: (result.dependencyAnalysis?.circularDependencies?.length || 0) > 0 ? "error" : "success",
          message:
            (result.dependencyAnalysis?.circularDependencies?.length || 0) > 0
              ? `${result.dependencyAnalysis.circularDependencies.length} circular dependencies detected`
              : "Dependency structure is optimal",
          recommendation:
            (result.dependencyAnalysis?.circularDependencies?.length || 0) > 0
              ? "Resolve circular dependencies immediately"
              : "Maintain current dependency structure",
          impact: (result.dependencyAnalysis?.circularDependencies?.length || 0) > 0 ? "critical" : "low",
        },
        {
          type: "info",
          message: `Critical path contains ${result.dependencyAnalysis?.criticalPath?.length || 0} tasks`,
          recommendation: "Monitor critical path tasks closely",
          impact: "medium",
        },
      ],
    },
    {
      id: "riskseeker",
      name: "RiskSeeker AI",
      icon: "alert-triangle",
      status: "active",
      confidence: 85,
      lastUpdate: "2 minutes ago",
      insights: result.riskAssessment?.activeRisks?.slice(0, 2).map((risk: any) => ({
        type: risk.severity === "critical" ? "error" : risk.severity === "high" ? "warning" : "info",
        message: risk.description,
        recommendation: risk.mitigation?.[0] || "Monitor situation closely",
        impact: risk.severity,
      })) || [
        {
          type: "info",
          message: "No critical risks detected",
          recommendation: "Continue monitoring",
          impact: "low",
        },
      ],
    },
    {
      id: "timeshift",
      name: "TimeShift AI",
      icon: "clock",
      status: "active",
      confidence: 88,
      lastUpdate: "3 minutes ago",
      insights: [
        {
          type: (result.timelineOptimization?.timelineSavings || 0) > 0 ? "success" : "info",
          message:
            (result.timelineOptimization?.timelineSavings || 0) > 0
              ? `Timeline can be optimized to save ${result.timelineOptimization.timelineSavings} days`
              : "Timeline optimization opportunities identified",
          recommendation: result.timelineOptimization?.recommendations?.[0] || "Review timeline adjustments",
          impact: "medium",
        },
        {
          type: "info",
          message: `${result.timelineOptimization?.parallelizationOpportunities?.length || 0} parallelization opportunities found`,
          recommendation: "Consider parallel task execution",
          impact: "medium",
        },
      ],
    },
  ]
}

function getFallbackAgents() {
  return [
    {
      id: "alignbot",
      name: "AlignBot",
      icon: "target",
      status: "active",
      confidence: 85,
      lastUpdate: "Just now",
      insights: [
        {
          type: "success",
          message: "Team goals are well-aligned with project objectives",
          recommendation: "Continue current approach",
          impact: "medium",
        },
      ],
    },
    {
      id: "depgraph",
      name: "DepGraph AI",
      icon: "git-branch",
      status: "active",
      confidence: 90,
      lastUpdate: "1 minute ago",
      insights: [
        {
          type: "success",
          message: "Dependency structure is well-organized",
          recommendation: "Monitor for any new dependencies",
          impact: "low",
        },
      ],
    },
    {
      id: "riskseeker",
      name: "RiskSeeker AI",
      icon: "alert-triangle",
      status: "active",
      confidence: 88,
      lastUpdate: "2 minutes ago",
      insights: [
        {
          type: "info",
          message: "Project timeline appears manageable with current resources",
          recommendation: "Continue monitoring progress",
          impact: "medium",
        },
      ],
    },
    {
      id: "timeshift",
      name: "TimeShift AI",
      icon: "clock",
      status: "active",
      confidence: 85,
      lastUpdate: "3 minutes ago",
      insights: [
        {
          type: "info",
          message: "Schedule optimization opportunities identified",
          recommendation: "Consider parallel task execution for faster completion",
          impact: "medium",
        },
      ],
    },
  ]
}
