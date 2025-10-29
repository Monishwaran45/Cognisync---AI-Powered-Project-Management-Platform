import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const teamMembersFile = path.join(dataDir, "team-members.json")

export async function PUT(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const body = await request.json()

    let teamMembers
    try {
      const data = await fs.readFile(teamMembersFile, "utf8")
      teamMembers = JSON.parse(data)
    } catch {
      return NextResponse.json({ error: "Team members not found" }, { status: 404 })
    }

    const memberIndex = teamMembers.findIndex((member: any) => member.id === params.memberId)
    if (memberIndex === -1) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    // Update team member
    teamMembers[memberIndex] = {
      ...teamMembers[memberIndex],
      ...body,
      id: params.memberId, // Ensure ID doesn't change
    }

    await fs.writeFile(teamMembersFile, JSON.stringify(teamMembers, null, 2))

    return NextResponse.json(teamMembers[memberIndex])
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    let teamMembers
    try {
      const data = await fs.readFile(teamMembersFile, "utf8")
      teamMembers = JSON.parse(data)
    } catch {
      return NextResponse.json({ error: "Team members not found" }, { status: 404 })
    }

    const memberIndex = teamMembers.findIndex((member: any) => member.id === params.memberId)
    if (memberIndex === -1) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    // Remove team member
    const deletedMember = teamMembers.splice(memberIndex, 1)[0]
    await fs.writeFile(teamMembersFile, JSON.stringify(teamMembers, null, 2))

    return NextResponse.json({ message: "Team member deleted successfully", member: deletedMember })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
  }
}
