"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const skillsData = [
  {
    skill: "React",
    members: [
      { name: "Alex Rivera", level: 95 },
      { name: "Mike Johnson", level: 70 },
      { name: "Sarah Chen", level: 40 },
    ],
    demand: "High",
    coverage: 85,
  },
  {
    skill: "Node.js",
    members: [
      { name: "Mike Johnson", level: 90 },
      { name: "Alex Rivera", level: 60 },
    ],
    demand: "High",
    coverage: 75,
  },
  {
    skill: "UI/UX Design",
    members: [
      { name: "Sarah Chen", level: 95 },
      { name: "Alex Rivera", level: 50 },
    ],
    demand: "Medium",
    coverage: 90,
  },
  {
    skill: "Python",
    members: [
      { name: "Mike Johnson", level: 85 },
      { name: "Emma Davis", level: 60 },
    ],
    demand: "Medium",
    coverage: 70,
  },
  {
    skill: "Testing",
    members: [
      { name: "Emma Davis", level: 90 },
      { name: "Alex Rivera", level: 45 },
    ],
    demand: "Medium",
    coverage: 80,
  },
  {
    skill: "Product Management",
    members: [{ name: "David Kim", level: 95 }],
    demand: "Low",
    coverage: 95,
  },
]

export function SkillsMatrix() {
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "text-green-600"
    if (coverage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-4">
      {skillsData.map((skill) => (
        <div key={skill.skill} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold">{skill.skill}</h4>
              <Badge variant={getDemandColor(skill.demand)}>{skill.demand} Demand</Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Coverage</div>
              <div className={`font-semibold ${getCoverageColor(skill.coverage)}`}>{skill.coverage}%</div>
            </div>
          </div>

          <div className="space-y-2">
            {skill.members.map((member) => (
              <div key={member.name} className="flex items-center justify-between">
                <span className="text-sm">{member.name}</span>
                <div className="flex items-center space-x-2 w-32">
                  <Progress value={member.level} className="h-2" />
                  <span className="text-xs text-gray-600 w-8">{member.level}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Coverage</span>
              <div className="flex items-center space-x-2">
                <Progress value={skill.coverage} className="h-2 w-24" />
                <span className={`font-medium ${getCoverageColor(skill.coverage)}`}>{skill.coverage}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
