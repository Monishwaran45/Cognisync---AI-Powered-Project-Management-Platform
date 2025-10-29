"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Target, Activity, Zap, Shield } from "lucide-react"

interface ProjectAnalyticsDashboardProps {
  projectId: string
}

export function ProjectAnalyticsDashboard({ projectId }: ProjectAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [projectId])

  const fetchAnalyticsData = async () => {
    try {
      // Mock data for demonstration
      const mockData = {
        overview: {
          healthScore: 85,
          completionRate: 67,
          budgetUtilization: 72,
          teamEfficiency: 91,
          riskScore: 23,
          velocityTrend: 8.5,
        },
        progressData: [
          { month: "Jan", planned: 20, actual: 18, budget: 15000, spent: 12000 },
          { month: "Feb", planned: 35, actual: 32, budget: 25000, spent: 22000 },
          { month: "Mar", planned: 50, actual: 48, budget: 35000, spent: 31000 },
          { month: "Apr", planned: 65, actual: 67, budget: 45000, spent: 43000 },
          { month: "May", planned: 80, actual: 75, budget: 55000, spent: 52000 },
          { month: "Jun", planned: 95, actual: 89, budget: 65000, spent: 61000 },
        ],
        taskAnalysis: [
          { complexity: "Low", effort: 2, count: 15, color: "#10B981" },
          { complexity: "Medium", effort: 5, count: 23, color: "#F59E0B" },
          { complexity: "High", effort: 8, count: 12, color: "#EF4444" },
          { complexity: "Critical", effort: 12, count: 5, color: "#8B5CF6" },
        ],
        priorityDistribution: [
          { name: "High", value: 35, color: "#EF4444" },
          { name: "Medium", value: 45, color: "#F59E0B" },
          { name: "Low", value: 20, color: "#10B981" },
        ],
        teamWorkload: [
          { member: "Alice", frontend: 8, backend: 3, testing: 2, total: 13 },
          { member: "Bob", frontend: 2, backend: 9, testing: 1, total: 12 },
          { member: "Carol", frontend: 5, backend: 4, testing: 6, total: 15 },
          { member: "David", frontend: 1, backend: 7, testing: 3, total: 11 },
          { member: "Eve", frontend: 6, backend: 2, testing: 4, total: 12 },
        ],
        skillsRadar: [
          { skill: "Frontend", teamAvg: 7.5, required: 8 },
          { skill: "Backend", teamAvg: 8.2, required: 7 },
          { skill: "DevOps", teamAvg: 6.8, required: 8 },
          { skill: "Testing", teamAvg: 7.1, required: 7.5 },
          { skill: "Design", teamAvg: 6.5, required: 6 },
          { skill: "Management", teamAvg: 8.0, required: 7.5 },
        ],
        budgetBreakdown: [
          { category: "Development", allocated: 40000, spent: 35000, remaining: 5000 },
          { category: "Design", allocated: 15000, spent: 12000, remaining: 3000 },
          { category: "Testing", allocated: 10000, spent: 8500, remaining: 1500 },
          { category: "Infrastructure", allocated: 8000, spent: 7200, remaining: 800 },
          { category: "Marketing", allocated: 12000, spent: 9000, remaining: 3000 },
        ],
        riskMatrix: [
          { risk: "Technical Debt", probability: 0.7, impact: 0.8, severity: "High" },
          { risk: "Resource Shortage", probability: 0.4, impact: 0.9, severity: "Medium" },
          { risk: "Scope Creep", probability: 0.6, impact: 0.6, severity: "Medium" },
          { risk: "Integration Issues", probability: 0.3, impact: 0.7, severity: "Low" },
          { risk: "Timeline Delays", probability: 0.5, impact: 0.8, severity: "High" },
        ],
        velocityData: [
          { sprint: "Sprint 1", planned: 25, completed: 23, velocity: 0.92 },
          { sprint: "Sprint 2", planned: 28, completed: 26, velocity: 0.93 },
          { sprint: "Sprint 3", planned: 30, completed: 32, velocity: 1.07 },
          { sprint: "Sprint 4", planned: 27, completed: 25, velocity: 0.93 },
          { sprint: "Sprint 5", planned: 29, completed: 31, velocity: 1.07 },
          { sprint: "Sprint 6", planned: 26, completed: 28, velocity: 1.08 },
        ],
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-black/20 border-white/10 text-white">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-xl">Loading analytics...</div>
        </CardContent>
      </Card>
    )
  }

  if (!analyticsData) {
    return (
      <Card className="bg-black/20 border-white/10 text-white">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-xl">No analytics data available</div>
        </CardContent>
      </Card>
    )
  }

  const { overview } = analyticsData

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{overview.healthScore}%</div>
            <Progress value={overview.healthScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{overview.completionRate}%</div>
            <Progress value={overview.completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{overview.budgetUtilization}%</div>
            <Progress value={overview.budgetUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{overview.teamEfficiency}%</div>
            <Progress value={overview.teamEfficiency} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{overview.riskScore}%</div>
            <Progress value={overview.riskScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{overview.velocityTrend}</div>
            <p className="text-xs text-gray-400 mt-1">Story points/sprint</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-black/20 border border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Progress vs Plan</CardTitle>
                <CardDescription>Monthly progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="planned"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Budget Tracking</CardTitle>
                <CardDescription>Planned vs actual spending</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="budget" fill="#F59E0B" />
                    <Bar dataKey="spent" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Task Complexity vs Effort</CardTitle>
                <CardDescription>Analysis of task distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={analyticsData.taskAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="effort" stroke="#9CA3AF" />
                    <YAxis dataKey="count" stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Scatter dataKey="count" fill="#8B5CF6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Task priorities breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.priorityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.priorityDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Team Workload</CardTitle>
                <CardDescription>Current task distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.teamWorkload}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="member" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="frontend" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="backend" stackId="a" fill="#10B981" />
                    <Bar dataKey="testing" stackId="a" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Team vs required skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analyticsData.skillsRadar}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
                    <PolarRadiusAxis stroke="#9CA3AF" />
                    <Radar name="Team Average" dataKey="teamAvg" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Radar name="Required" dataKey="required" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <Treemap
                    data={analyticsData.budgetBreakdown}
                    dataKey="allocated"
                    ratio={4 / 3}
                    stroke="#fff"
                    fill="#3B82F6"
                  />
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
                <CardDescription>Allocated vs spent vs remaining</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.budgetBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="allocated" fill="#3B82F6" />
                    <Bar dataKey="spent" fill="#EF4444" />
                    <Bar dataKey="remaining" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
              <CardDescription>Probability vs Impact analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={analyticsData.riskMatrix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="probability"
                    stroke="#9CA3AF"
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis
                    dataKey="impact"
                    stroke="#9CA3AF"
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [
                      name === "probability"
                        ? `${((value as number) * 100).toFixed(0)}%`
                        : `${((value as number) * 100).toFixed(0)}%`,
                      name === "probability" ? "Probability" : "Impact",
                    ]}
                  />
                  <Scatter dataKey="impact" fill="#EF4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-4">
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Sprint Velocity Tracking</CardTitle>
              <CardDescription>Planned vs completed story points</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="sprint" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="velocity" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
