
import type { Metadata } from "next"
import Link from "next/link"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Verify Email - TalkToText Pro",
  description: "Verify your email to complete your TalkToText Pro account setup.",
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <VerifyEmailForm />
        </div>
      </main>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
    </div>
  )
}
