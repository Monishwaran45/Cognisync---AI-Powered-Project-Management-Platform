import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const projectsFile = path.join(dataDir, "projects.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get all projects
export async function GET() {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(projectsFile, "utf8")
      const projects = JSON.parse(data)
      return NextResponse.json(projects)
    } catch {
      // If file doesn't exist, return sample data
      const sampleProjects = [
        {
          id: 1,
          name: "E-commerce Platform Redesign",
          description:
            "Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance",
          priority: "high",
          teamSize: 8,
          deadline: "2024-02-15",
          status: "active",
          progress: 35,
          tasksCount: 12,
          aiAlerts: 2,
          createdAt: new Date().toISOString(),
        },
      ]

      await fs.writeFile(projectsFile, JSON.stringify(sampleProjects, null, 2))
      return NextResponse.json(sampleProjects)
    }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// Create new project
export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()

    const body = await request.json()

    // Get existing projects
    let projects = []
    try {
      const data = await fs.readFile(projectsFile, "utf8")
      projects = JSON.parse(data)
    } catch {
      // File doesn't exist, start with empty array
    }

    // Create new project
    const newProject = {
      id: Date.now(),
      ...body,
      progress: 0,
      tasksCount: 0,
      aiAlerts: 0,
      createdAt: new Date().toISOString(),
    }

    projects.push(newProject)

    // Save to file
    await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2))

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
