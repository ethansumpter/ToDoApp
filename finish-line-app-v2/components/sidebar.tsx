"use client";

import { SidebarBrand } from "@/components/sidebar/sidebar-brand";
import { SidebarActions } from "@/components/sidebar/sidebar-actions";
import { SidebarNavigation, NavigationItem } from "@/components/sidebar/sidebar-navigation";
import { SidebarUserProfile } from "@/components/sidebar/sidebar-user-profile";
import { useUserProfile } from "@/hooks/use-user-profile";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Users, 
  Settings, 
  Bell
} from "lucide-react";

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Boards",
    href: "/boards",
    icon: FolderKanban,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { userProfile, isLoading } = useUserProfile();
  
  const handleProfileClick = () => {
    console.log("Opening user profile...");
  };

  const handleNotificationClick = () => {
    console.log("Opening notifications...");
  };

  // Create user object for SidebarUserProfile
  const user = userProfile ? {
    name: `${userProfile.first_name} ${userProfile.last_name}`,
    email: userProfile.email,
    initials: `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}`.toUpperCase()
  } : {
    name: "Loading...",
    email: "Loading...",
    initials: "..."
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <SidebarBrand />
      
      <SidebarActions />
      
      <SidebarNavigation items={navigation} />
      
      <SidebarUserProfile 
        user={user}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
        notificationCount={3}
      />
    </div>
  );
}