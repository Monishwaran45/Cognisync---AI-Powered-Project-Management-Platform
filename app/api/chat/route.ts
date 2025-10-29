import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const projectsFile = path.join(dataDir, "projects.json")

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { message, projectId } = body

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 })
    }

    let projectContext = null

    // If projectId is provided, get project context
    if (projectId) {
      try {
        const data = await fs.readFile(projectsFile, "utf8")
        const projects = JSON.parse(data)
        projectContext = projects.find((p: any) => p.id === Number.parseInt(projectId))
      } catch (error) {
        console.log("Could not load project context:", error)
        // Continue without project context
      }
    }

    // Always use fallback response to preserve quota
    const aiResponse = getFallbackResponse(message, projectContext)

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error("Chat API error:", error)

    return NextResponse.json(
      {
        message: "I'm experiencing technical difficulties. Please try again in a moment.",
      },
      { status: 200 },
    ) // Return 200 to avoid frontend error handling
  }
}

function getFallbackResponse(message: string, projectContext?: any): string {
  const lowerMessage = message.toLowerCase()

  // Context-aware responses
  if (projectContext) {
    const projectName = projectContext.name || "your project"

    if (lowerMessage.includes("status") || lowerMessage.includes("progress")) {
      return `Based on ${projectName}, I can see you're working on an active project. For status updates, I recommend checking the dashboard for real-time progress metrics, task completion rates, and team performance indicators. Would you like me to help you interpret any specific metrics?`
    }

    if (lowerMessage.includes("risk")) {
      return `For ${projectName}, I can help identify potential risks. Common risk areas include timeline delays, resource constraints, and dependency bottlenecks. Based on typical project patterns, focus on monitoring overdue tasks, team workload distribution, and critical path dependencies. What specific risks are you concerned about?`
    }
  }

  const fallbackResponses = {
    help: "I'm your AI project management assistant. I can help you with risk assessment, timeline optimization, resource allocation, team coordination, and task management. I analyze project data to provide actionable insights and recommendations. What specific area would you like assistance with?",

    risk: "I can help you identify and assess project risks. Key risk indicators include: 1) Overdue tasks and missed deadlines, 2) Overloaded team members, 3) Blocked dependencies, 4) Resource shortages, 5) Scope creep. I recommend implementing regular risk reviews and maintaining contingency plans. What risks are you currently facing?",

    timeline:
      "For timeline optimization, focus on: 1) Identifying critical path tasks that impact project completion, 2) Finding opportunities for parallel task execution, 3) Adding appropriate buffer time for high-risk activities, 4) Monitoring progress against milestones. I can help you analyze your current timeline. What timeline challenges do you have?",

    team: "Effective team management requires: 1) Clear communication channels and regular check-ins, 2) Balanced workload distribution across team members, 3) Proper skill matching for task assignments, 4) Defined roles and responsibilities, 5) Regular performance feedback. How can I help with your team coordination?",

    task: "For optimal task management: 1) Break complex tasks into smaller, manageable pieces, 2) Set clear priorities and realistic deadlines, 3) Track progress regularly with measurable milestones, 4) Identify and resolve blockers quickly, 5) Ensure proper task dependencies. Which tasks need attention?",

    dependency:
      "Task dependencies are crucial for project flow. Best practices include: 1) Mapping all task relationships clearly, 2) Identifying and resolving circular dependencies, 3) Creating parallel work streams where possible, 4) Monitoring critical path tasks closely, 5) Having contingency plans for blocked tasks. Need help with specific dependencies?",

    insight:
      "I can provide insights on project performance based on key metrics: 1) Task completion rates and velocity trends, 2) Resource utilization and workload balance, 3) Risk indicators and mitigation strategies, 4) Timeline adherence and optimization opportunities, 5) Team productivity and collaboration patterns. What insights would be most valuable?",

    progress:
      "To track project progress effectively: 1) Use consistent metrics across all tasks and teams, 2) Implement regular checkpoint reviews and status updates, 3) Monitor trends and patterns to identify issues early, 4) Adjust plans based on actual performance data, 5) Communicate progress clearly to stakeholders. What progress metrics are you tracking?",

    optimize:
      "Project optimization opportunities typically include: 1) Streamlining task dependencies and workflows, 2) Balancing resource allocation and team workloads, 3) Implementing parallel execution where possible, 4) Reducing bottlenecks and eliminating waste, 5) Improving communication and coordination. What area would you like to optimize?",

    default:
      "I'm here to help optimize your project management with data-driven insights. I can assist with risk assessment, timeline optimization, resource allocation, team coordination, and task management. Based on best practices, I recommend focusing on regular progress monitoring, proactive risk management, and clear team communication. What specific aspect of your project would you like to discuss?",
  }

  // Find matching response
  for (const [key, response] of Object.entries(fallbackResponses)) {
    if (key !== "default" && lowerMessage.includes(key)) {
      return response
    }
  }

  return fallbackResponses.default
}
