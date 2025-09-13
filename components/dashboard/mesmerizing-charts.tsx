"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
} from "recharts"
import { TrendingUp, Users, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { getWeeklyActivity, getMeetingTypes, getProcessingSpeed, WeeklyActivity, MeetingType, ProcessingSpeed } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

const PIE_CHART_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

export function MesmerizingCharts() {
  const [weeklyData, setWeeklyData] = useState<WeeklyActivity[]>([]);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [processingSpeed, setProcessingSpeed] = useState<ProcessingSpeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const [weekly, types, speed] = await Promise.all([
          getWeeklyActivity(),
          getMeetingTypes(),
          getProcessingSpeed(),
        ]);
        setWeeklyData(weekly);
        setMeetingTypes(types);
        setProcessingSpeed(speed);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 h-[400px]"><CardContent className="pt-6"><Skeleton className="h-full w-full" /></CardContent></Card>
        <Card className="h-[400px]"><CardContent className="pt-6"><Skeleton className="h-full w-full" /></CardContent></Card>
        <Card className="lg:col-span-3 h-[400px]"><CardContent className="pt-6"><Skeleton className="h-full w-full" /></CardContent></Card>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-2"
      >
        <Card className="glass border-0 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg animate-pulse">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Weekly Activity Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="meetingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} className="text-muted-foreground" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(16px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="meetings"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#meetingsGradient)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meeting Types Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass border-0 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 group overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg animate-pulse">
                <Users className="h-6 w-6 text-white" />
              </div>
              Meeting Types
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 h-[300px] flex flex-col">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meetingTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={2000}
                  >
                    {meetingTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(16px)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {meetingTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-lg animate-pulse"
                    style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Processing Speed Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="lg:col-span-3"
      >
        <Card className="glass border-0 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg animate-pulse">
                <Zap className="h-6 w-6 text-white" />
              </div>
              AI Processing Speed Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processingSpeed}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} className="text-muted-foreground" allowDecimals={false}/>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(16px)",
                  }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} animationDuration={2000} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}