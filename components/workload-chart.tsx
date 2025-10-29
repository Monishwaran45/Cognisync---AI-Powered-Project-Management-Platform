"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const workloadData = [
  {
    name: "Sarah Chen",
    current: 32,
    capacity: 40,
    utilization: 80,
  },
  {
    name: "Mike Johnson",
    current: 38,
    capacity: 40,
    utilization: 95,
  },
  {
    name: "Alex Rivera",
    current: 24,
    capacity: 40,
    utilization: 60,
  },
  {
    name: "Emma Davis",
    current: 16,
    capacity: 40,
    utilization: 40,
  },
  {
    name: "David Kim",
    current: 35,
    capacity: 40,
    utilization: 88,
  },
]

export function WorkloadChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={workloadData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value, name) => [`${value} hours`, name === "current" ? "Current Workload" : "Capacity"]}
            labelFormatter={(label) => `Team Member: ${label}`}
          />
          <Legend />
          <Bar dataKey="current" fill="#3b82f6" name="Current Workload" radius={[2, 2, 0, 0]} />
          <Bar dataKey="capacity" fill="#e5e7eb" name="Total Capacity" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
