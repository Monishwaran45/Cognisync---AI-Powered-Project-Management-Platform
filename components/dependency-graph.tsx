"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, RotateCcw, Filter, Search, Info } from "lucide-react"

interface Node {
  id: string
  name: string
  type: "task" | "milestone" | "dependency"
  status: "completed" | "in-progress" | "blocked" | "not-started"
  x: number
  y: number
  dependencies: string[]
  assignee?: string
  priority: "high" | "medium" | "low"
  estimatedHours?: number
}

interface DependencyGraphProps {
  projectId: string
}

export function DependencyGraph({ projectId }: DependencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Mock data for dependency graph
    const mockNodes: Node[] = [
      {
        id: "1",
        name: "Project Setup",
        type: "milestone",
        status: "completed",
        x: 100,
        y: 100,
        dependencies: [],
        assignee: "Alice",
        priority: "high",
        estimatedHours: 8,
      },
      {
        id: "2",
        name: "Database Design",
        type: "task",
        status: "completed",
        x: 250,
        y: 150,
        dependencies: ["1"],
        assignee: "Bob",
        priority: "high",
        estimatedHours: 16,
      },
      {
        id: "3",
        name: "API Development",
        type: "task",
        status: "in-progress",
        x: 400,
        y: 100,
        dependencies: ["2"],
        assignee: "Carol",
        priority: "high",
        estimatedHours: 32,
      },
      {
        id: "4",
        name: "Frontend Components",
        type: "task",
        status: "in-progress",
        x: 400,
        y: 250,
        dependencies: ["2"],
        assignee: "David",
        priority: "medium",
        estimatedHours: 24,
      },
      {
        id: "5",
        name: "Authentication System",
        type: "task",
        status: "blocked",
        x: 550,
        y: 150,
        dependencies: ["3"],
        assignee: "Eve",
        priority: "high",
        estimatedHours: 20,
      },
      {
        id: "6",
        name: "User Interface",
        type: "task",
        status: "not-started",
        x: 550,
        y: 300,
        dependencies: ["4"],
        assignee: "Frank",
        priority: "medium",
        estimatedHours: 28,
      },
      {
        id: "7",
        name: "Integration Testing",
        type: "task",
        status: "not-started",
        x: 700,
        y: 200,
        dependencies: ["5", "6"],
        assignee: "Grace",
        priority: "high",
        estimatedHours: 16,
      },
      {
        id: "8",
        name: "Deployment",
        type: "milestone",
        status: "not-started",
        x: 850,
        y: 200,
        dependencies: ["7"],
        assignee: "Henry",
        priority: "high",
        estimatedHours: 12,
      },
    ]

    setNodes(mockNodes)
  }, [projectId])

  useEffect(() => {
    drawGraph()
  }, [nodes, zoom, pan, filter, searchTerm])

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and pan
    ctx.save()
    ctx.scale(zoom, zoom)
    ctx.translate(pan.x, pan.y)

    // Filter nodes
    const filteredNodes = nodes.filter((node) => {
      const matchesFilter = filter === "all" || node.status === filter
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })

    // Draw connections first
    filteredNodes.forEach((node) => {
      node.dependencies.forEach((depId) => {
        const depNode = filteredNodes.find((n) => n.id === depId)
        if (depNode) {
          drawConnection(ctx, depNode, node)
        }
      })
    })

    // Draw nodes
    filteredNodes.forEach((node) => {
      drawNode(ctx, node)
    })

    ctx.restore()
  }

  const drawConnection = (ctx: CanvasRenderingContext2D, from: Node, to: Node) => {
    ctx.beginPath()
    ctx.moveTo(from.x + 30, from.y + 15)
    ctx.lineTo(to.x - 10, to.y + 15)
    ctx.strokeStyle = "#4B5563"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrow
    const angle = Math.atan2(to.y - from.y, to.x - from.x)
    const arrowLength = 10
    ctx.beginPath()
    ctx.moveTo(to.x - 10, to.y + 15)
    ctx.lineTo(
      to.x - 10 - arrowLength * Math.cos(angle - Math.PI / 6),
      to.y + 15 - arrowLength * Math.sin(angle - Math.PI / 6),
    )
    ctx.moveTo(to.x - 10, to.y + 15)
    ctx.lineTo(
      to.x - 10 - arrowLength * Math.cos(angle + Math.PI / 6),
      to.y + 15 - arrowLength * Math.sin(angle + Math.PI / 6),
    )
    ctx.strokeStyle = "#4B5563"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  const drawNode = (ctx: CanvasRenderingContext2D, node: Node) => {
    const isSelected = selectedNode?.id === node.id

    // Node background
    ctx.fillStyle = getNodeColor(node.status)
    if (node.type === "milestone") {
      // Draw diamond for milestones
      ctx.beginPath()
      ctx.moveTo(node.x + 15, node.y)
      ctx.lineTo(node.x + 30, node.y + 15)
      ctx.lineTo(node.x + 15, node.y + 30)
      ctx.lineTo(node.x, node.y + 15)
      ctx.closePath()
      ctx.fill()
    } else {
      // Draw rectangle for tasks
      ctx.fillRect(node.x, node.y, 120, 30)
    }

    // Selection highlight
    if (isSelected) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 3
      if (node.type === "milestone") {
        ctx.beginPath()
        ctx.moveTo(node.x + 15, node.y)
        ctx.lineTo(node.x + 30, node.y + 15)
        ctx.lineTo(node.x + 15, node.y + 30)
        ctx.lineTo(node.x, node.y + 15)
        ctx.closePath()
        ctx.stroke()
      } else {
        ctx.strokeRect(node.x, node.y, 120, 30)
      }
    }

    // Node text
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "12px Inter"
    ctx.textAlign = "center"
    ctx.fillText(
      node.name.length > 15 ? node.name.substring(0, 15) + "..." : node.name,
      node.x + (node.type === "milestone" ? 15 : 60),
      node.y + 20,
    )
  }

  const getNodeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981"
      case "in-progress":
        return "#3B82F6"
      case "blocked":
        return "#EF4444"
      case "not-started":
        return "#6B7280"
      default:
        return "#6B7280"
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x * zoom) / zoom
    const y = (e.clientY - rect.top - pan.y * zoom) / zoom

    // Find clicked node
    const clickedNode = nodes.find((node) => {
      if (node.type === "milestone") {
        // Check if click is within diamond bounds
        return x >= node.x && x <= node.x + 30 && y >= node.y && y <= node.y + 30
      } else {
        // Check if click is within rectangle bounds
        return x >= node.x && x <= node.x + 120 && y >= node.y && y <= node.y + 30
      }
    })

    setSelectedNode(clickedNode || null)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.3))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedNode(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls */}
        <Card className="bg-black/20 border-white/10 text-white lg:w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Graph Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Tasks</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Status</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom & Pan</label>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleZoomIn} className="flex-1">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleZoomOut} className="flex-1">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleReset} className="flex-1">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-400 text-center">Zoom: {Math.round(zoom * 100)}%</div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Legend</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-xs">Not Started</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 transform rotate-45"></div>
                  <span className="text-xs">Milestone</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graph Canvas */}
        <Card className="bg-black/20 border-white/10 text-white flex-1">
          <CardHeader>
            <CardTitle>Dependency Graph</CardTitle>
            <CardDescription>Interactive visualization of task dependencies and project flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-white/10 rounded-lg cursor-move bg-slate-900/50"
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />

              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-3 h-3" />
                  <span className="font-medium">Instructions</span>
                </div>
                <div>• Click nodes to select and view details</div>
                <div>• Drag to pan around the graph</div>
                <div>• Use zoom controls to scale view</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task Details</span>
              <Badge className={`${getNodeColor(selectedNode.status)} text-white`}>
                {selectedNode.status.replace("-", " ").toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Name</label>
                <p className="text-white">{selectedNode.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Type</label>
                <p className="text-white capitalize">{selectedNode.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Assignee</label>
                <p className="text-white">{selectedNode.assignee || "Unassigned"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Priority</label>
                <Badge
                  className={
                    selectedNode.priority === "high"
                      ? "bg-red-600/20 text-red-300 border-red-500/30"
                      : selectedNode.priority === "medium"
                        ? "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
                        : "bg-green-600/20 text-green-300 border-green-500/30"
                  }
                >
                  {selectedNode.priority.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Estimated Hours</label>
                <p className="text-white">{selectedNode.estimatedHours || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Dependencies</label>
                <p className="text-white">
                  {selectedNode.dependencies.length > 0 ? selectedNode.dependencies.join(", ") : "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
