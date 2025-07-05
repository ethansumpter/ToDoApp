import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  email: string;
  initials: string;
}

interface SidebarUserProfileProps {
  user: User;
  className?: string;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

export function SidebarUserProfile({ user, className, onProfileClick, onNotificationClick, notificationCount }: SidebarUserProfileProps) {
  return (
    <div className={cn("border-t p-4", className)}>
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors flex-1"
          onClick={onProfileClick}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 h-8 w-8"
          onClick={onNotificationClick}
        >
          <Bell className="h-4 w-4" />
          {notificationCount && notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
