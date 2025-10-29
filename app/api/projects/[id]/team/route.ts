import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock team data
    const team = [
      {
        id: "member-1",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "UX Designer",
        skills: ["UX Design", "User Research", "Prototyping", "Figma"],
        capacity: 40,
        currentWorkload: 34,
        availability: "available",
      },
      {
        id: "member-2",
        name: "Alex Rivera",
        email: "alex.rivera@company.com",
        role: "UI Designer",
        skills: ["UI Design", "Design Systems", "Figma", "Adobe Creative Suite"],
        capacity: 40,
        currentWorkload: 30,
        availability: "available",
      },
      {
        id: "member-3",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "Frontend Developer",
        skills: ["React", "TypeScript", "CSS", "JavaScript"],
        capacity: 40,
        currentWorkload: 36,
        availability: "busy",
      },
      {
        id: "member-4",
        name: "Emma Davis",
        email: "emma.davis@company.com",
        role: "Backend Developer",
        skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
        capacity: 40,
        currentWorkload: 28,
        availability: "available",
      },
      {
        id: "member-5",
        name: "David Kim",
        email: "david.kim@company.com",
        role: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        capacity: 40,
        currentWorkload: 24,
        availability: "available",
      },
      {
        id: "member-6",
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        role: "QA Engineer",
        skills: ["Test Automation", "Selenium", "Jest", "Cypress"],
        capacity: 40,
        currentWorkload: 22,
        availability: "available",
      },
    ]

    return NextResponse.json(team)
  } catch (error) {
    console.error("Error fetching team:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const memberData = await request.json()

    // In a real app, you would save to database
    const newMember = {
      id: `member-${Date.now()}`,
      ...memberData,
      currentWorkload: 0,
      availability: "available",
    }

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Error adding team member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
