import type { Metadata } from "next"
import { UploadZone } from "@/components/dashboard/upload-zone"

export const metadata: Metadata = {
  title: "Upload | TalkToText Pro",
  description: "Upload your audio files for AI-powered transcription and note generation.",
}

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload Audio</h1>
          <p className="text-muted-foreground mt-2">
            Upload your meeting recordings to generate AI-powered transcriptions and structured notes.
          </p>
        </div>

        <UploadZone />
      </div>
    </div>
  )
}
