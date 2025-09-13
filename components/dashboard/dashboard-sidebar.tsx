"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutDashboard, Upload, History, User, LogOut } from "lucide-react"
import { useUser } from "@/context/user-provider"

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload",
    url: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Use window.location to force a full page refresh and clear all state
    window.location.href = "/login";
  };

  const getInitials = () => {
    if (!user) return "??";
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase() || user.username[0].toUpperCase();
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="TalkToText Pro"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
            {/* UPDATED: Profile button now links directly to the profile page */}
            <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" disabled={isLoading}>
                    <Link href="/profile">
                        {isLoading ? (
                            <>
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            </>
                        ) : (
                            <>
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user?.avatar_url} alt={user?.username} />
                                <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.first_name || 'User'} {user?.last_name}</span>
                                <span className="truncate text-xs">{user?.username}</span>
                            </div>
                            </>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}