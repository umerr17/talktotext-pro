"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Users, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { getDashboardStats, DashboardStats as StatsData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Meetings",
      value: stats?.total_meetings,
      icon: FileText,
      description: "Processed successfully",
    },
    {
      title: "Hours Processed",
      value: stats?.hours_processed,
      icon: Clock,
      description: "Total transcription time",
    },
    {
      title: "Team Members",
      value: stats?.team_members,
      icon: Users,
      description: "In your workspace",
    },
    {
      title: "Accuracy Rate",
      value: stats ? `${stats.accuracy_rate}%` : null,
      icon: Brain,
      description: "AI transcription accuracy",
    },
  ];

  if (isLoading) {
      return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                  <Card key={i} className="glass">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-4 w-4 rounded-full" />
                      </CardHeader>
                      <CardContent>
                          <Skeleton className="h-7 w-1/3 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                  </Card>
              ))}
          </div>
      )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => (
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
              <div className="text-2xl font-bold">{stat.value ?? 'N/A'}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}