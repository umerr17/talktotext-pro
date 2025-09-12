"use client"

import type { Metadata } from "next"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Reset Password - TalkToText Pro",
  description: "Reset your TalkToText Pro account password.",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Button variant="ghost" asChild>
          <Link href="/login" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </main>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
    </div>
  )
}
