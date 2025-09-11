import type { Metadata } from "next"
import { SettingsTabs } from "@/components/settings/settings-tabs"

export const metadata: Metadata = {
  title: "Settings | TalkToText Pro",
  description: "Manage your account settings and preferences.",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings, notifications, and preferences.</p>
        </div>

        <SettingsTabs />
      </div>
    </div>
  )
}
