import type { Metadata } from "next"
import { MeetingHistory } from "@/components/dashboard/meeting-history"

export const metadata: Metadata = {
  title: "History | TalkToText Pro",
  description: "View and manage your meeting history and generated notes.",
}

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Meeting History</h1>
          <p className="text-muted-foreground mt-2">
            View all your processed meetings, transcriptions, and generated notes.
          </p>
        </div>

        <MeetingHistory />
      </div>
    </div>
  )
}
