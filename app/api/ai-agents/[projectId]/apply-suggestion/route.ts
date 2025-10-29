import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const body = await request.json()
    const { agentId, insightIndex } = body

    // Simulate applying AI suggestion
    let result = ""

    switch (agentId) {
      case "alignbot":
        result = "Team alignment suggestion applied. Sprint goals have been updated and team notifications sent."
        break
      case "depgraph":
        result = "Dependency optimization applied. Task #3 has been split into parallel subtasks."
        break
      case "riskseeker":
        result = "Risk mitigation applied. Buffer time added to high-risk tasks and monitoring alerts enabled."
        break
      case "timeshift":
        result = "Timeline optimization applied. Task schedules updated and team calendars synchronized."
        break
      default:
        result = "AI suggestion has been applied to your project."
    }

    return NextResponse.json({
      success: true,
      message: result,
      appliedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error applying AI suggestion:", error)
    return NextResponse.json({ error: "Failed to apply AI suggestion" }, { status: 500 })
  }
}
