import { NextResponse } from "next/server"
import { getAIStatus, resetQuotaStatus } from "@/lib/gemini"

export async function GET() {
  try {
    const status = getAIStatus()
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get AI status",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    resetQuotaStatus()
    const status = getAIStatus()
    return NextResponse.json({
      message: "AI quota status reset successfully",
      status,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reset AI status",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
