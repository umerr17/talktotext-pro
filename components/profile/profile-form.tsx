"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, User, AlertTriangle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile, updateUserProfile, uploadAvatar, UserProfile as UserProfileData, deleteAccount } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setFormData(profile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load your profile.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setIsLoading(true);

    try {
        const updatedProfile = await uploadAvatar(file);
        setFormData(updatedProfile);
        toast({ title: "Success!", description: "Profile picture updated." });
    } catch (error) {
        toast({ title: "Error", description: "Failed to upload picture.", variant: "destructive" });
        setAvatarPreview(null); // Revert preview on error
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
        const updatedProfile = await updateUserProfile({
            first_name: formData.first_name,
            last_name: formData.last_name,
            company: formData.company,
            job_title: formData.job_title,
        });
        setFormData(updatedProfile);
        toast({
            title: "Success!",
            description: "Your profile has been updated.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Omit<UserProfileData, 'id' | 'username' | 'avatar_url'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await deleteAccount();
            toast({
                title: "Account Deleted",
                description: "Your account and all data have been permanently deleted.",
            });
            localStorage.removeItem("token");
            router.push("/");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete your account. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

  const getInitials = () => {
      const firstNameInitial = formData.first_name?.[0] || '';
      const lastNameInitial = formData.last_name?.[0] || '';
      return `${firstNameInitial}${lastNameInitial}`.toUpperCase() || <User className="h-8 w-8" />;
  }

  if (isFetching) {
      return (
          <div className="space-y-6">
              <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
              <Card><CardContent className="pt-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || formData.avatar_url} alt="Profile" />
                <AvatarFallback className="text-lg">
                    {getInitials()}
                </AvatarFallback>
              </Avatar>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
              <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0" onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                {formData.first_name || 'Your'} {formData.last_name || 'Name'}
              </h2>
              <p className="text-muted-foreground">{formData.username}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.first_name || ""}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.last_name || ""}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.job_title || ""}
                  onChange={(e) => handleInputChange("job_title", e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80">
                  These actions are permanent and cannot be undone.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center justify-between">
                  <div>
                      <h5 className="font-medium">Delete Account</h5>
                      <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data.
                      </p>
                  </div>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={isLoading}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your
                                  account and remove all your data from our servers.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                  onClick={handleDeleteAccount}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                  Yes, delete my account
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              </div>
          </CardContent>
      </Card>
    </div>
  )
}