import { NextResponse } from "next/server"
import { HealthChecker } from "@/lib/debug-utils"

export async function GET() {
  try {
    const health = await HealthChecker.checkSystemHealth()
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Health check failed",
        message: error.message,
        timestamp: new Date(),
      },
      { status: 500 },
    )
  }
}
