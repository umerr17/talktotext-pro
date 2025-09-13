import type { Metadata } from "next"
import { UploadZone } from "@/components/dashboard/upload-zone"
import { MeetingHistory } from "@/components/dashboard/meeting-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Plus, Sparkles } from "lucide-react"
import { MesmerizingStats } from "@/components/dashboard/mesmerizing-stats"
import { FloatingElements } from "@/components/dashboard/floating-elements"
import { MesmerizingCharts } from "@/components/dashboard/mesmerizing-charts"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle" // 👈 I've added this import

export const metadata: Metadata = {
  title: "Dashboard - TalkToText Pro",
  description: "Manage your meeting recordings and AI-generated notes in your TalkToText Pro dashboard.",
}

export default function DashboardPage() {
  return (
    <>
      <FloatingElements />
      <div className="relative space-y-8 z-10">
        {/* Header */}
        {/* 👇 I've modified the header below */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-8 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Welcome back!
              </h1>
              <p className="text-lg text-muted-foreground">
                Transform your meeting recordings into structured notes with AI
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/dashboard/upload">
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                New Upload
              </Link>
            </Button>
          </div>

          <MesmerizingStats />

          <MesmerizingCharts />

          {/* Combined Upload and Activity Zone */}
          <Card className="glass border-0 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Quick Upload & Activity
              </CardTitle>
              <CardDescription className="text-base">
                Upload a new recording to get started. Ongoing tasks will appear below.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <UploadZone />
            </CardContent>
          </Card>

          {/* Meeting History */}
          <MeetingHistory />
        </div>
      </div>
    </>
  )
}