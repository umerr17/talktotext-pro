import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Sign In - TalkToText Pro",
  description: "Sign in to your TalkToText Pro account to access AI-powered meeting notes and transcription tools.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
    </div>
  )
}
