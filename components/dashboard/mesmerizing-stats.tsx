"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Clock, Users, Brain, TrendingUp, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getDashboardStats, DashboardStats as StatsData } from "@/lib/api"

// This is a simplified interface for the stats card props
interface StatCard {
  title: string
  value: string
  icon: React.ElementType
  gradient: string
  iconGradient: string
  glowColor: string
}

const statCardStyles = [
  {
    icon: FileText,
    gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    iconGradient: "from-blue-500 to-indigo-600",
    glowColor: "shadow-blue-500/25",
  },
  {
    icon: Clock,
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    iconGradient: "from-emerald-500 to-teal-600",
    glowColor: "shadow-emerald-500/25",
  },
  {
    icon: Users,
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    iconGradient: "from-orange-500 to-amber-600",
    glowColor: "shadow-orange-500/25",
  },
  {
    icon: Brain,
    gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
    iconGradient: "from-pink-500 to-rose-600",
    glowColor: "shadow-pink-500/25",
  },
]

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000 }: { value: string | number; duration?: number }) {
  const [count, setCount] = useState(0)
  const numericValue = Number.parseFloat(String(value).replace(/[^0-9.]/g, ""))

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(numericValue * easeOutQuart)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericValue, duration])

  return (
    <span>
      {String(value).includes("%")
        ? `${count.toFixed(1)}%`
        : String(value).includes(".")
          ? count.toFixed(1)
          : Math.floor(count).toLocaleString()}
    </span>
  )
}

export function MesmerizingStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
        // Set some default error state if needed
        setStats({ total_meetings: 0, hours_processed: 0, team_members: 0, accuracy_rate: 0 })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass border-0 bg-card/80 p-6">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const formattedStats: StatCard[] = [
    {
      title: "Meetings Processed",
      value: stats?.total_meetings.toString() ?? "0",
      ...statCardStyles[0],
    },
    {
      title: "Hours Processed",
      value: stats?.hours_processed.toString() ?? "0",
      ...statCardStyles[1],
    },
    {
      title: "Team Members",
      value: stats?.team_members.toString() ?? "1",
      ...statCardStyles[2],
    },
    {
      title: "Accuracy Rate",
      value: `${stats?.accuracy_rate}%`,
      ...statCardStyles[3],
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {formattedStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.15,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          whileHover={{
            y: -8,
            rotateY: 5,
            transition: { duration: 0.3 },
          }}
          className="group perspective-1000"
        >
          <Card
            className={`
            relative overflow-hidden border-0 bg-gradient-to-br ${stat.gradient} 
            backdrop-blur-xl hover:shadow-2xl ${stat.glowColor} 
            transition-all duration-500 group-hover:scale-105
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 
            group-hover:before:opacity-100 before:transition-opacity before:duration-500
          `}
          >
            <CardContent className="relative p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  className={`
                    p-3 rounded-xl bg-gradient-to-br ${stat.iconGradient} 
                    shadow-lg group-hover:shadow-xl transition-all duration-300
                    group-hover:scale-110 group-hover:rotate-12
                  `}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.5, type: "spring" }}
                >
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/30 transition-colors">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                </motion.div>
              </div>

              <div className="space-y-2">
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                >
                  <AnimatedCounter value={stat.value} duration={2000 + index * 200} />
                </motion.div>

                <motion.p
                  className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.6 }}
                >
                  {stat.title}
                </motion.p>
              </div>

              {/* Sparkle effect on hover */}
              <motion.div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0, rotate: 0 }}
                whileHover={{ scale: 1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="h-4 w-4 text-primary/60" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}