import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Icon } from "@/components/ui/icon-picker";
import { BoardMainActions } from "./board-main-actions";

interface BoardHeaderProps {
  title: string;
  shareCode: string;
  icon?: string;
  allowedUsersCount: number;
  deadline?: string;
  isAdmin: boolean;
  onBackClick: () => void;
  onSettingsClick?: () => void;
}

export function BoardHeader({
  title,
  shareCode,
  icon,
  allowedUsersCount,
  deadline,
  isAdmin,
  onBackClick,
  onSettingsClick
}: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Boards
        </Button>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name={icon as any} className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">
              Share Code: <span className="font-mono">{shareCode}</span>
            </p>
          </div>
        </div>
      </div>
      <BoardMainActions
        allowedUsersCount={allowedUsersCount}
        deadline={deadline}
        isAdmin={isAdmin}
        onSettingsClick={onSettingsClick}
      />
    </div>
  );
}
