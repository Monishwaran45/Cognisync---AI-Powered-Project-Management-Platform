export interface AgentMessage {
  id: string
  from: string
  to: string
  type: "status_update" | "risk_alert" | "resource_request" | "dependency_change" | "timeline_update"
  data: any
  timestamp: Date
  priority: "low" | "medium" | "high" | "critical"
}

export interface AgentState {
  id: string
  name: string
  status: "active" | "idle" | "processing" | "error"
  lastUpdate: Date
  confidence: number
  currentTask?: string
}

export abstract class BaseAgent {
  protected id: string
  protected name: string
  protected state: AgentState
  protected messageQueue: AgentMessage[] = []
  protected subscribers: Set<string> = new Set()

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.state = {
      id,
      name,
      status: "idle",
      lastUpdate: new Date(),
      confidence: 100,
    }
  }

  abstract process(data: any): Promise<any>
  abstract handleMessage(message: AgentMessage): Promise<void>

  async sendMessage(to: string, type: AgentMessage["type"], data: any, priority: AgentMessage["priority"] = "medium") {
    try {
      const message: AgentMessage = {
        id: `${this.id}-${Date.now()}`,
        from: this.id,
        to,
        type,
        data,
        timestamp: new Date(),
        priority,
      }

      // In a real system, this would go through a message broker
      await this.deliverMessage(message)
      return message
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  private async deliverMessage(message: AgentMessage) {
    try {
      // Simulate message delivery - in production, use Redis/RabbitMQ
      const targetAgent = AgentRegistry.getAgent(message.to)
      if (targetAgent && typeof targetAgent.receiveMessage === "function") {
        await targetAgent.receiveMessage(message)
      }
    } catch (error) {
      console.error("Error delivering message:", error)
    }
  }

  async receiveMessage(message: AgentMessage) {
    try {
      this.messageQueue.push(message)
      await this.handleMessage(message)
    } catch (error) {
      console.error("Error receiving message:", error)
    }
  }

  subscribe(agentId: string) {
    try {
      this.subscribers.add(agentId)
    } catch (error) {
      console.error("Error subscribing:", error)
    }
  }

  unsubscribe(agentId: string) {
    try {
      this.subscribers.delete(agentId)
    } catch (error) {
      console.error("Error unsubscribing:", error)
    }
  }

  protected async broadcast(type: AgentMessage["type"], data: any, priority: AgentMessage["priority"] = "medium") {
    try {
      const promises = Array.from(this.subscribers).map((subscriberId) =>
        this.sendMessage(subscriberId, type, data, priority).catch((error) => {
          console.error(`Failed to send message to ${subscriberId}:`, error)
          return null
        }),
      )
      await Promise.allSettled(promises)
    } catch (error) {
      console.error("Error broadcasting:", error)
    }
  }

  getState(): AgentState {
    return { ...this.state }
  }

  protected updateState(updates: Partial<AgentState>) {
    try {
      this.state = { ...this.state, ...updates, lastUpdate: new Date() }
    } catch (error) {
      console.error("Error updating state:", error)
    }
  }
}

// Global agent registry for inter-agent communication
export class AgentRegistry {
  private static agents: Map<string, BaseAgent> = new Map()

  static registerAgent(agent: BaseAgent) {
    try {
      if (!agent || !agent.id) {
        throw new Error("Invalid agent provided for registration")
      }
      this.agents.set(agent.id, agent)
    } catch (error) {
      console.error("Error registering agent:", error)
    }
  }

  static getAgent(id: string): BaseAgent | undefined {
    try {
      return this.agents.get(id)
    } catch (error) {
      console.error("Error getting agent:", error)
      return undefined
    }
  }

  static getAllAgents(): BaseAgent[] {
    try {
      return Array.from(this.agents.values())
    } catch (error) {
      console.error("Error getting all agents:", error)
      return []
    }
  }

  static removeAgent(id: string) {
    try {
      this.agents.delete(id)
    } catch (error) {
      console.error("Error removing agent:", error)
    }
  }
}
