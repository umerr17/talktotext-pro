"use client"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UploadZone } from "@/components/dashboard/upload-zone"
import { MeetingHistory } from "@/components/dashboard/meeting-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Plus, Sparkles, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const handleLogout = () => {
    localStorage.removeItem("token");
    // Use window.location to force a full page refresh and clear all state
    window.location.href = "/login";
  };

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
        <div className="ml-auto flex items-center gap-2 px-4">
            <ThemeToggle />
            <Button
      variant="ghost"
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
    >
      <LogOut className="h-5 w-5" />
      <span>Sign out</span>
    </Button>
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
          <Button size="lg" className="h-12" asChild>
            <Link href="/dashboard/upload">
                <Plus className="mr-2 h-4 w-4" />
                New Upload
            </Link>
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
                {/* This section is now handled by the persistent UploadZone component */}
              <div className="text-center text-muted-foreground py-8">
                <p>Ongoing tasks will appear in the upload zone below.</p>
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