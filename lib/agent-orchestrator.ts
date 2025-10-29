import { AgentRegistry } from "./agents/base-agent"
import { TeamAgent } from "./agents/team-agent"
import { DependencyTrackerAgent } from "./agents/dependency-tracker-agent"
import { RiskDetectionAgent } from "./agents/risk-detection-agent"
import { TimelineAdjustmentAgent } from "./agents/timeline-adjustment-agent"
import { ResourceAllocationAgent } from "./agents/resource-allocation-agent"
import { DebugLogger, PerformanceMonitor } from "./debug-utils"

export interface ProjectData {
  project: any
  tasks: any[]
  teams: any[]
  dependencies: any[]
  resources: any[]
  skillRequirements: any[]
  historicalProjects?: any[]
}

export interface OrchestrationResult {
  teamInsights: any[]
  dependencyAnalysis: any
  riskAssessment: any
  timelineOptimization: any
  resourceOptimization: any
  overallHealth: {
    score: number
    level: "excellent" | "good" | "fair" | "poor" | "critical"
    summary: string
    recommendations: string[]
  }
  agentStates: any[]
}

export class AgentOrchestrator {
  private agents: Map<string, any> = new Map()
  private isInitialized = false

  constructor() {
    try {
      this.initializeAgents()
    } catch (error) {
      console.error("Failed to initialize agents:", error)
      this.isInitialized = false
    }
  }

  private initializeAgents() {
    try {
      // Create and register all agents
      const dependencyTracker = new DependencyTrackerAgent()
      const riskDetector = new RiskDetectionAgent()
      const timelineAdjuster = new TimelineAdjustmentAgent()
      const resourceAllocator = new ResourceAllocationAgent()

      // Register agents
      AgentRegistry.registerAgent(dependencyTracker)
      AgentRegistry.registerAgent(riskDetector)
      AgentRegistry.registerAgent(timelineAdjuster)
      AgentRegistry.registerAgent(resourceAllocator)

      // Store references
      this.agents.set("dependency-tracker", dependencyTracker)
      this.agents.set("risk-detector", riskDetector)
      this.agents.set("timeline-adjuster", timelineAdjuster)
      this.agents.set("resource-allocator", resourceAllocator)

      this.isInitialized = true
    } catch (error) {
      console.error("Error initializing agents:", error)
      throw error
    }
  }

  async orchestrateProject(projectData: ProjectData): Promise<OrchestrationResult> {
    const logger = DebugLogger.getInstance()
    logger.logAgentActivity("orchestrator", "Starting project orchestration", { projectId: projectData.project?.id })

    if (!this.isInitialized) {
      logger.logError(new Error("Agent orchestrator not initialized"), "orchestrateProject")
      throw new Error("Agent orchestrator not initialized")
    }

    try {
      // Create team agents dynamically based on project teams
      const teamAgents = await PerformanceMonitor.measureAsync("create-team-agents", () =>
        this.createTeamAgents(projectData.teams || []),
      )

      // Phase 1: Parallel analysis by all agents with error handling
      logger.log("info", "Starting parallel agent analysis")
      const results = await Promise.allSettled([
        PerformanceMonitor.measureAsync("dependency-analysis", () =>
          this.safeAgentProcess("dependency-tracker", {
            tasks: projectData.tasks || [],
            dependencies: projectData.dependencies || [],
          }),
        ),
        PerformanceMonitor.measureAsync("risk-analysis", () => this.safeAgentProcess("risk-detector", projectData)),
        PerformanceMonitor.measureAsync("timeline-analysis", () =>
          this.safeAgentProcess("timeline-adjuster", {
            project: projectData.project,
            tasks: projectData.tasks || [],
            dependencies: projectData.dependencies || [],
            resources: projectData.resources || [],
            constraints: [],
          }),
        ),
        PerformanceMonitor.measureAsync("resource-analysis", () =>
          this.safeAgentProcess("resource-allocator", {
            resources: projectData.resources || [],
            tasks: projectData.tasks || [],
            teams: projectData.teams || [],
            currentAllocations: [],
            skillRequirements: projectData.skillRequirements || [],
          }),
        ),
        PerformanceMonitor.measureAsync("team-analysis", () => this.processTeamInsights(teamAgents, projectData)),
      ])

      // Log results
      results.forEach((result, index) => {
        const agentNames = [
          "dependency-tracker",
          "risk-detector",
          "timeline-adjuster",
          "resource-allocator",
          "team-insights",
        ]
        if (result.status === "rejected") {
          logger.logError(result.reason, `Agent ${agentNames[index]} failed`)
        } else {
          logger.log("info", `Agent ${agentNames[index]} completed successfully`)
        }
      })

      // Extract results or use fallbacks
      const [dependencyAnalysis, riskAssessment, timelineOptimization, resourceOptimization, teamInsights] =
        results.map((result, index) => {
          if (result.status === "fulfilled") {
            return result.value
          } else {
            console.error(`Agent ${index} failed:`, result.reason)
            return this.getFallbackResult(index)
          }
        })

      // Phase 2: Cross-agent communication (with error handling)
      try {
        await this.facilitateCrossAgentCommunication({
          dependencyAnalysis,
          riskAssessment,
          timelineOptimization,
          resourceOptimization,
          teamInsights,
        })
      } catch (commError) {
        console.error("Cross-agent communication failed:", commError)
      }

      // Phase 3: Calculate overall project health
      const overallHealth = this.calculateOverallHealth({
        dependencyAnalysis,
        riskAssessment,
        timelineOptimization,
        resourceOptimization,
        teamInsights,
      })

      // Phase 4: Collect agent states
      const agentStates = this.collectAgentStates()

      return {
        teamInsights: teamInsights || [],
        dependencyAnalysis: dependencyAnalysis || this.getFallbackDependencyAnalysis(),
        riskAssessment: riskAssessment || this.getFallbackRiskAssessment(),
        timelineOptimization: timelineOptimization || this.getFallbackTimelineOptimization(),
        resourceOptimization: resourceOptimization || this.getFallbackResourceOptimization(),
        overallHealth,
        agentStates,
      }
    } catch (error) {
      console.error("Error in agent orchestration:", error)
      // Return fallback result
      return this.getFallbackOrchestrationResult()
    }
  }

  private async safeAgentProcess(agentId: string, data: any) {
    try {
      const agent = this.agents.get(agentId)
      if (!agent || typeof agent.process !== "function") {
        throw new Error(`Agent ${agentId} not found or invalid`)
      }
      return await agent.process(data)
    } catch (error) {
      console.error(`Agent ${agentId} process failed:`, error)
      throw error
    }
  }

  private getFallbackResult(index: number) {
    switch (index) {
      case 0:
        return this.getFallbackDependencyAnalysis()
      case 1:
        return this.getFallbackRiskAssessment()
      case 2:
        return this.getFallbackTimelineOptimization()
      case 3:
        return this.getFallbackResourceOptimization()
      case 4:
        return []
      default:
        return null
    }
  }

  private getFallbackDependencyAnalysis() {
    return {
      nodes: [],
      edges: [],
      criticalPath: [],
      circularDependencies: [],
      healthScore: 75,
    }
  }

  private getFallbackRiskAssessment() {
    return {
      overallRiskScore: 30,
      riskLevel: "medium" as const,
      activeRisks: [],
      predictedDelays: [],
      recommendations: ["Monitor project progress closely"],
    }
  }

  private getFallbackTimelineOptimization() {
    return {
      adjustments: [],
      newProjectEndDate: new Date(),
      timelineSavings: 0,
      resourceOptimizations: [],
      parallelizationOpportunities: [],
      recommendations: ["Timeline appears optimal"],
    }
  }

  private getFallbackResourceOptimization() {
    return {
      allocations: [],
      reallocationSuggestions: [],
      workloadBalancing: [],
      skillGapAnalysis: [],
      urgentRequests: [],
    }
  }

  private getFallbackOrchestrationResult(): OrchestrationResult {
    return {
      teamInsights: [],
      dependencyAnalysis: this.getFallbackDependencyAnalysis(),
      riskAssessment: this.getFallbackRiskAssessment(),
      timelineOptimization: this.getFallbackTimelineOptimization(),
      resourceOptimization: this.getFallbackResourceOptimization(),
      overallHealth: {
        score: 75,
        level: "good",
        summary: "Project analysis temporarily unavailable, using fallback assessment",
        recommendations: ["Check system status", "Retry analysis later"],
      },
      agentStates: [],
    }
  }

  private async createTeamAgents(teams: any[]): Promise<TeamAgent[]> {
    const teamAgents: TeamAgent[] = []

    try {
      for (const team of teams) {
        const teamAgent = new TeamAgent(team.id, team.name)
        AgentRegistry.registerAgent(teamAgent)
        this.agents.set(`team-${team.id}`, teamAgent)
        teamAgents.push(teamAgent)
      }
    } catch (error) {
      console.error("Error creating team agents:", error)
    }

    return teamAgents
  }

  private async processTeamInsights(teamAgents: TeamAgent[], projectData: ProjectData) {
    const insights = []

    try {
      for (const teamAgent of teamAgents) {
        try {
          const teamId = teamAgent.id.replace("team-", "")

          // Filter tasks for this team
          const teamTasks = (projectData.tasks || [])
            .filter((task) => task.teamId === teamId)
            .map((task) => ({
              id: task.id,
              title: task.title,
              status: task.status,
              assignee: task.assignee,
              priority: task.priority,
              estimatedHours: task.estimatedHours || 0,
              actualHours: task.actualHours || 0,
              dependencies: task.dependencies || [],
              blockers: [],
              dueDate: new Date(task.endDate || Date.now()),
              progress: task.progress || 0,
            }))

          // Filter team members for this team
          const teamMembers = (projectData.resources || [])
            .filter((resource) => resource.teamId === teamId)
            .map((resource) => ({
              id: resource.id,
              name: resource.name,
              skills: resource.skills || [],
              currentWorkload: 0, // Calculate based on tasks
              maxCapacity: resource.capacity || 40,
              availability: resource.availability || "available",
            }))

          // Calculate workload for team members
          teamMembers.forEach((member) => {
            const memberTasks = teamTasks.filter((task) => task.assignee === member.name)
            member.currentWorkload = memberTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)
          })

          const teamInsight = await teamAgent.process({
            tasks: teamTasks,
            members: teamMembers,
          })

          insights.push({
            teamId,
            ...teamInsight,
          })
        } catch (teamError) {
          console.error(`Team agent ${teamAgent.id} failed:`, teamError)
          // Add fallback insight for this team
          insights.push({
            teamId: teamAgent.id.replace("team-", ""),
            status: {
              confidence: 50,
              productivity: 75,
              bottlenecks: [],
              recommendations: ["Team analysis temporarily unavailable"],
              riskLevel: "medium",
            },
            recommendations: ["Team analysis temporarily unavailable"],
            blockers: [],
            workloadDistribution: [],
          })
        }
      }
    } catch (error) {
      console.error("Error processing team insights:", error)
    }

    return insights
  }

  private async facilitateCrossAgentCommunication(results: any) {
    try {
      // Risk detector alerts timeline adjuster about high-risk tasks
      if (results.riskAssessment?.riskLevel === "high" || results.riskAssessment?.riskLevel === "critical") {
        const timelineAgent = this.agents.get("timeline-adjuster")
        if (timelineAgent && typeof timelineAgent.receiveMessage === "function") {
          try {
            await timelineAgent.receiveMessage({
              id: `risk-alert-${Date.now()}`,
              from: "risk-detector",
              to: "timeline-adjuster",
              type: "risk_alert",
              data: {
                risks: (results.riskAssessment.activeRisks || []).filter(
                  (risk: any) => risk.severity === "high" || risk.severity === "critical",
                ),
                predictedDelays: results.riskAssessment.predictedDelays || [],
              },
              timestamp: new Date(),
              priority: "high",
            })
          } catch (msgError) {
            console.error("Failed to send risk alert:", msgError)
          }
        }
      }

      // Additional communication logic with error handling...
    } catch (error) {
      console.error("Error in cross-agent communication:", error)
    }
  }

  private calculateOverallHealth(results: any) {
    try {
      let score = 100
      const issues: string[] = []
      const recommendations: string[] = []

      // Dependency health impact (25% weight)
      const dependencyScore = results.dependencyAnalysis?.healthScore || 75
      score -= (100 - dependencyScore) * 0.25

      if ((results.dependencyAnalysis?.circularDependencies?.length || 0) > 0) {
        issues.push(`${results.dependencyAnalysis.circularDependencies.length} circular dependencies detected`)
        recommendations.push("Resolve circular dependencies immediately")
      }

      // Risk assessment impact (30% weight)
      const riskImpact =
        {
          low: 0,
          medium: 15,
          high: 30,
          critical: 50,
        }[results.riskAssessment?.riskLevel || "medium"] || 15

      score -= riskImpact * 0.3

      if (results.riskAssessment?.riskLevel === "high" || results.riskAssessment?.riskLevel === "critical") {
        issues.push(`Project risk level: ${results.riskAssessment.riskLevel}`)
        if (results.riskAssessment.recommendations) {
          recommendations.push(...results.riskAssessment.recommendations.slice(0, 2))
        }
      }

      // Timeline optimization impact (25% weight)
      const timelineSavings = results.timelineOptimization?.timelineSavings || 0
      if (timelineSavings > 0) {
        score += Math.min(15, timelineSavings * 2) // Bonus for time savings
      } else if (timelineSavings < -5) {
        score -= Math.abs(timelineSavings) * 2 // Penalty for delays
        issues.push(`Project timeline extended by ${Math.abs(timelineSavings)} days`)
      }

      // Resource optimization impact (20% weight)
      const overallocatedCount = (results.resourceOptimization?.workloadBalancing || []).filter(
        (wb: any) => wb.currentUtilization > 100,
      ).length

      score -= overallocatedCount * 5

      if (overallocatedCount > 0) {
        issues.push(`${overallocatedCount} resources are overallocated`)
        recommendations.push("Rebalance resource allocation")
      }

      // Team insights impact
      const teamIssues = (results.teamInsights || []).filter(
        (insight: any) => insight.riskLevel === "high" || insight.riskLevel === "critical",
      ).length

      score -= teamIssues * 8

      // Determine health level
      let level: "excellent" | "good" | "fair" | "poor" | "critical"
      if (score >= 90) level = "excellent"
      else if (score >= 75) level = "good"
      else if (score >= 60) level = "fair"
      else if (score >= 40) level = "poor"
      else level = "critical"

      // Generate summary
      let summary = ""
      if (level === "excellent") {
        summary = "Project is performing exceptionally well with minimal risks and optimal resource utilization."
      } else if (level === "good") {
        summary = "Project is on track with minor issues that can be easily addressed."
      } else if (level === "fair") {
        summary = "Project has some challenges that require attention to prevent delays."
      } else if (level === "poor") {
        summary = "Project faces significant challenges that need immediate intervention."
      } else {
        summary = "Project is in critical condition and requires urgent action to prevent failure."
      }

      return {
        score: Math.max(0, Math.min(100, Math.round(score))),
        level,
        summary,
        recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      }
    } catch (error) {
      console.error("Error calculating overall health:", error)
      return {
        score: 75,
        level: "good" as const,
        summary: "Health calculation temporarily unavailable",
        recommendations: ["Check system status"],
      }
    }
  }

  private collectAgentStates() {
    const states = []

    try {
      for (const [agentId, agent] of this.agents.entries()) {
        try {
          if (agent && typeof agent.getState === "function") {
            states.push({
              agentId,
              ...agent.getState(),
            })
          }
        } catch (stateError) {
          console.error(`Failed to get state for agent ${agentId}:`, stateError)
          states.push({
            agentId,
            status: "error",
            lastUpdate: new Date(),
            confidence: 0,
          })
        }
      }
    } catch (error) {
      console.error("Error collecting agent states:", error)
    }

    return states
  }

  // Public methods for external access
  getAgent(agentId: string) {
    return this.agents.get(agentId)
  }

  getAllAgents() {
    return Array.from(this.agents.values())
  }

  async shutdownAgents() {
    try {
      // Clean up agents
      for (const [agentId, agent] of this.agents.entries()) {
        try {
          AgentRegistry.removeAgent(agentId)
        } catch (cleanupError) {
          console.error(`Error removing agent ${agentId}:`, cleanupError)
        }
      }
      this.agents.clear()
      this.isInitialized = false
    } catch (error) {
      console.error("Error shutting down agents:", error)
    }
  }
}
