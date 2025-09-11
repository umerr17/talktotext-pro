import type { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Sign Up - TalkToText Pro",
  description:
    "Create your TalkToText Pro account and start transforming meeting recordings into professional notes with AI.",
}

export default function SignupPage() {
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
          <SignupForm />
        </div>
      </main>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
    </div>
  )
}
