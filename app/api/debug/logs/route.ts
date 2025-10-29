import { NextResponse } from "next/server"
import { DebugLogger } from "@/lib/debug-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level") as "info" | "warn" | "error" | "debug" | null
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const logger = DebugLogger.getInstance()
    const logs = logger.getLogs(level || undefined, limit)

    return NextResponse.json({
      logs,
      total: logs.length,
      level: level || "all",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    const logger = DebugLogger.getInstance()
    logger.clearLogs()

    return NextResponse.json({
      message: "Logs cleared successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to clear logs",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
