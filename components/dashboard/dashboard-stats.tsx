"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Users, Brain } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "Total Meetings",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: FileText,
    description: "This month",
  },
  {
    title: "Hours Processed",
    value: "18.5",
    change: "+8%",
    changeType: "positive" as const,
    icon: Clock,
    description: "Total transcription time",
  },
  {
    title: "Team Members",
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
    description: "Active participants",
  },
  {
    title: "Accuracy Rate",
    value: "98.5%",
    change: "+0.3%",
    changeType: "positive" as const,
    icon: Brain,
    description: "AI transcription accuracy",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="glass hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge
                  variant={stat.changeType === "positive" ? "default" : "secondary"}
                  className={stat.changeType === "positive" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                >
                  {stat.change}
                </Badge>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
