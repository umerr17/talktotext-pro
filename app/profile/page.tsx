import type { Metadata } from "next"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Profile | TalkToText Pro",
  description: "Manage your profile information and preferences.",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and account preferences.</p>
        </div>

        <ProfileForm />
      </div>
    </div>
  )
}
