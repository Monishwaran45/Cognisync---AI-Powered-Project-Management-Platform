"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RefreshCw, Trash2, AlertCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  context?: any
}

interface HealthStatus {
  timestamp: string
  status: "healthy" | "degraded" | "unhealthy"
  services: {
    ai: {
      status: string
      message: string
      lastCheck: string
      details?: any
    }
    database: { status: string; message: string; lastCheck: string }
    agents: { status: string; message: string; lastCheck: string }
  }
  performance: Record<string, any>
}

interface AIStatus {
  hasApiKey: boolean
  modelInitialized: boolean
  quotaExceeded: boolean
  consecutiveFailures: number
  lastQuotaCheck: string
  isAvailable: boolean
}

export function DebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  useEffect(() => {
    fetchLogs()
    fetchHealth()
    fetchAIStatus()
  }, [])

  const fetchLogs = async (level?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (level && level !== "all") params.append("level", level)
      params.append("limit", "200")

      const response = await fetch(`/api/debug/logs?${params}`)
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHealth = async () => {
    try {
      const response = await fetch("/api/debug/health")
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error("Failed to fetch health status:", error)
    }
  }

  const fetchAIStatus = async () => {
    try {
      const response = await fetch("/api/debug/ai-status")
      const data = await response.json()
      setAIStatus(data)
    } catch (error) {
      console.error("Failed to fetch AI status:", error)
    }
  }

  const resetAIQuota = async () => {
    try {
      const response = await fetch("/api/debug/ai-status", { method: "POST" })
      const data = await response.json()
      console.log("AI quota reset:", data.message)
      await fetchAIStatus()
      await fetchHealth()
    } catch (error) {
      console.error("Failed to reset AI quota:", error)
    }
  }

  const clearLogs = async () => {
    try {
      await fetch("/api/debug/logs", { method: "DELETE" })
      setLogs([])
    } catch (error) {
      console.error("Failed to clear logs:", error)
    }
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    fetchLogs(level)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status === "healthy" ? "default" : status === "degraded" ? "secondary" : "destructive"
    return <Badge variant={variant}>{status}</Badge>
  }

  const getLevelBadge = (level: string) => {
    const variants = {
      info: "default",
      warn: "secondary",
      error: "destructive",
      debug: "outline",
    }
    return <Badge variant={variants[level] || "outline"}>{level}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Debug Panel</h2>
        <div className="flex space-x-2">
          <Button onClick={fetchHealth} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Health
          </Button>
          <Button onClick={() => fetchLogs(selectedLevel)} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Logs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="ai-status">AI Service Status</TabsTrigger>
          <TabsTrigger value="logs">Application Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          {health ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(health.status)}
                    <span>Overall System Status</span>
                    {getStatusBadge(health.status)}
                  </CardTitle>
                  <CardDescription>Last checked: {new Date(health.timestamp).toLocaleString()}</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(health.services).map(([service, data]) => (
                  <Card key={service}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span className="capitalize">{service} Service</span>
                        {getStatusIcon(data.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getStatusBadge(data.status)}
                        <p className="text-sm text-gray-600">{data.message}</p>
                        <p className="text-xs text-gray-500">Last check: {new Date(data.lastCheck).toLocaleString()}</p>
                        {service === "ai" && data.details && (
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Consecutive failures: {data.details.consecutiveFailures}</p>
                            <p>Quota exceeded: {data.details.quotaExceeded ? "Yes" : "No"}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p>Loading health status...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-status">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Service Detailed Status</CardTitle>
                  <CardDescription>Detailed information about the AI service and quota status</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={fetchAIStatus} size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={resetAIQuota} size="sm" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Quota
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {aiStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">API Key</p>
                      <div className="flex items-center space-x-2">
                        {aiStatus.hasApiKey ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">{aiStatus.hasApiKey ? "Configured" : "Missing"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Model Initialized</p>
                      <div className="flex items-center space-x-2">
                        {aiStatus.modelInitialized ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">{aiStatus.modelInitialized ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Service Available</p>
                      <div className="flex items-center space-x-2">
                        {aiStatus.isAvailable ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">{aiStatus.isAvailable ? "Available" : "Unavailable"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Quota Status</p>
                      <div className="flex items-center space-x-2">
                        {aiStatus.quotaExceeded ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm">{aiStatus.quotaExceeded ? "Exceeded" : "OK"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Consecutive Failures</p>
                      <div className="flex items-center space-x-2">
                        {aiStatus.consecutiveFailures > 0 ? (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm">{aiStatus.consecutiveFailures}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Last Quota Check</p>
                      <p className="text-xs text-gray-500">{new Date(aiStatus.lastQuotaCheck).toLocaleString()}</p>
                    </div>
                  </div>

                  {aiStatus.quotaExceeded && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <p className="text-sm font-medium text-yellow-800">Quota Exceeded</p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        The AI service quota has been exceeded. The system is using fallback responses. You can try
                        resetting the quota status or wait for the quota to reset automatically.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Loading AI status...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Application Logs</CardTitle>
                  <CardDescription>Recent system activity and errors</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={selectedLevel}
                    onChange={(e) => handleLevelChange(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="error">Errors</option>
                    <option value="warn">Warnings</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                  <Button onClick={clearLogs} size="sm" variant="outline">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Logs
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No logs available</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="p-3 border rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            {getLevelBadge(log.level)}
                            <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-gray-800">{log.message}</p>
                        {log.context && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer">Show context</summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance and timing data</CardDescription>
            </CardHeader>
            <CardContent>
              {health?.performance ? (
                <div className="space-y-4">
                  {Object.entries(health.performance).map(([operation, metrics]: [string, any]) => (
                    <div key={operation} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{operation}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Calls</p>
                          <p className="font-medium">{metrics.callCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Average Time</p>
                          <p className="font-medium">{Math.round(metrics.averageTime)}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Time</p>
                          <p className="font-medium">{Math.round(metrics.totalTime)}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Call</p>
                          <p className="font-medium">{new Date(metrics.lastCall).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No performance data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
