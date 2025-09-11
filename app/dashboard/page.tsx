import type { Metadata } from "next"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UploadZone } from "@/components/dashboard/upload-zone"
import { MeetingHistory } from "@/components/dashboard/meeting-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Plus, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard - TalkToText Pro",
  description: "Manage your meeting recordings and AI-generated notes in your TalkToText Pro dashboard.",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
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
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-4 pt-0">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">Transform your meeting recordings into structured notes with AI</p>
          </div>
          <Button size="lg" className="h-12">
            <Plus className="mr-2 h-4 w-4" />
            New Upload
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Upload
              </CardTitle>
              <CardDescription>
                Upload a new meeting recording to get started with AI-powered transcription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadZone />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest meeting processing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product Strategy Meeting</p>
                    <p className="text-xs text-muted-foreground">Completed 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Weekly Team Standup</p>
                    <p className="text-xs text-muted-foreground">Processing...</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Client Presentation</p>
                    <p className="text-xs text-muted-foreground">Completed yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meeting History */}
        <MeetingHistory />
      </div>
    </div>
  )
}
