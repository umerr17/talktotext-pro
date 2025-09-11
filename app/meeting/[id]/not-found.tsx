import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileX, ArrowLeft } from "lucide-react"

export default function MeetingNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <FileX className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Meeting Not Found</CardTitle>
          <CardDescription>The meeting you're looking for doesn't exist or may have been deleted.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
