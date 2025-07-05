import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Settings } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";

interface BoardMainActionsProps {
  allowedUsersCount: number;
  deadline?: string;
  isAdmin: boolean;
  onSettingsClick?: () => void;
  onViewMembersClick?: () => void;
}

export function BoardMainActions({
  allowedUsersCount,
  deadline,
  isAdmin,
  onSettingsClick,
  onViewMembersClick
}: BoardMainActionsProps) {
  const isClient = useIsClient();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3"
        onClick={onViewMembersClick}
      >
        <Users className="h-3 w-3 mr-2" />
        {allowedUsersCount} member{allowedUsersCount !== 1 ? 's' : ''}
      </Button>
      
      {deadline && (
        <Badge variant="outline" className="h-8 px-3 py-1">
          <CalendarDays className="h-3 w-3 mr-2" />
          Due {isClient ? new Date(deadline).toLocaleDateString() : "Loading..."}
        </Badge>
      )}
      
      {isAdmin && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Board Settings
        </Button>
      )}
    </div>
  );
}
