import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MeetingSummary } from "@/components/meeting/meeting-summary"
import { TranscriptViewer } from "@/components/meeting/transcript-viewer"
import { ArrowLeft, Download, Share, FileText, MessageSquare } from "lucide-react"

// Mock data - in a real app, this would come from an API
const getMeetingData = (id: string) => {
  const meetings = {
    "1": {
      id: "1",
      title: "Product Strategy Meeting",
      date: "2024-01-15",
      duration: "45 min",
      participants: ["Sarah Chen", "Mike Rodriguez", "Emily Johnson", "David Park", "Lisa Thompson"],
      summary:
        "Comprehensive discussion on Q1 roadmap priorities, feature development timeline, and resource allocation. The team reviewed user feedback from beta testing and aligned on strategic objectives for the upcoming product release.",
      keyPoints: [
        "User feedback indicates strong demand for advanced analytics dashboard",
        "Current development timeline allows for 3-4 major features in Q1",
        "Resource allocation needs adjustment to accommodate new priorities",
        "Beta testing revealed performance issues that need immediate attention",
        "Marketing team requires feature freeze by end of February",
      ],
      actionItems: [
        {
          id: "1",
          task: "Finalize analytics dashboard wireframes",
          assignee: "Emily Johnson",
          dueDate: "2024-01-22",
          priority: "high" as const,
        },
        {
          id: "2",
          task: "Conduct performance optimization review",
          assignee: "David Park",
          dueDate: "2024-01-20",
          priority: "high" as const,
        },
        {
          id: "3",
          task: "Update project timeline documentation",
          assignee: "Sarah Chen",
          dueDate: "2024-01-25",
          priority: "medium" as const,
        },
        {
          id: "4",
          task: "Schedule follow-up with marketing team",
          assignee: "Mike Rodriguez",
          dueDate: "2024-01-18",
          priority: "low" as const,
        },
      ],
      decisions: [
        "Prioritize analytics dashboard for Q1 release",
        "Allocate additional engineering resources to performance optimization",
        "Implement feature freeze policy starting February 28th",
        "Establish weekly check-ins with stakeholders",
      ],
      sentiment: {
        overall: "positive" as const,
        score: 78,
        insights: [
          "Team showed high engagement and collaborative spirit",
          "Positive response to new feature proposals",
          "Some concerns raised about timeline feasibility",
          "Overall optimistic tone about project success",
        ],
      },
    },
  }

  return meetings[id as keyof typeof meetings] || null
}

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meeting = getMeetingData(params.id)

  if (!meeting) {
    return {
      title: "Meeting Not Found - TalkToText Pro",
    }
  }

  return {
    title: `${meeting.title} - TalkToText Pro`,
    description: `View AI-generated notes and transcript for ${meeting.title} meeting from ${new Date(meeting.date).toLocaleDateString()}.`,
  }
}

export default function MeetingDetailsPage({ params }: PageProps) {
  const meeting = getMeetingData(params.id)

  if (!meeting) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{meeting.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Word
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summary & Notes
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Full Transcript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <MeetingSummary meeting={meeting} />
          </TabsContent>

          <TabsContent value="transcript" className="space-y-6">
            <TranscriptViewer transcript={[]} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
