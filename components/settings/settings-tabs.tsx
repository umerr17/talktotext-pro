"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, CreditCard, Download, Trash2, AlertTriangle, Check, Crown } from "lucide-react"

export function SettingsTabs() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  })

  const [preferences, setPreferences] = useState({
    language: "en",
    autoTranscribe: true,
    autoSummarize: true,
    saveTranscripts: true,
  })

  return (
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-muted/50">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-transcribe uploads</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically start transcription when files are uploaded
                  </p>
                </div>
                <Switch
                  checked={preferences.autoTranscribe}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoTranscribe: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate summaries</Label>
                  <p className="text-sm text-muted-foreground">
                    Create meeting summaries automatically after transcription
                  </p>
                </div>
                <Switch
                  checked={preferences.autoSummarize}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoSummarize: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Save transcripts</Label>
                  <p className="text-sm text-muted-foreground">Keep original transcripts along with summaries</p>
                </div>
                <Switch
                  checked={preferences.saveTranscripts}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, saveTranscripts: checked }))}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Choose how you want to be notified about your meetings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about transcription progress and completion
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified in your browser when processing is complete
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and tips</p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing" className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and billing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">$29/month • Unlimited meetings</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Check className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Next billing date</span>
                <span className="text-muted-foreground">January 15, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment method</span>
                <span className="text-muted-foreground">•••• •••• •••• 4242</span>
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Update Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security and privacy settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" className="bg-background/50" />
              </div>
            </div>

            <Button>Update Password</Button>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </h4>
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Delete Account</h5>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
