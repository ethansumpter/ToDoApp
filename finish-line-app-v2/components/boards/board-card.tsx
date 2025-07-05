import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CalendarDays, 
  CheckCircle2, 
  Users, 
  MoreVertical, 
  Edit, 
  Archive, 
  UserPlus,
  ArchiveRestore
} from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { ProjectBoard } from "@/types/boards";
import { useState } from "react";

interface BoardCardProps {
  board: ProjectBoard;
  onBoardClick: (boardId: number) => void;
  onEditBoard: (boardId: number) => void;
  onArchiveBoard: (boardId: number) => void;
  onManageTeam: (boardId: number) => void;
  isArchived?: boolean;
}

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function BoardCard({ 
  board, 
  onBoardClick, 
  onEditBoard, 
  onArchiveBoard, 
  onManageTeam,
  isArchived = false 
}: BoardCardProps) {
  const isClient = useIsClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMenuAction = (action: () => void, event: React.MouseEvent) => {
    event.stopPropagation();
    action();
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1" onClick={() => onBoardClick(board.id)}>
            <CardTitle className="text-base">{board.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{board.subject}</p>
            {board.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {board.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 relative">
            {/* Role badge that slides left on hover */}
            <Badge 
              variant="outline" 
              className={`text-xs transition-transform duration-200 ease-in-out ${
                isDropdownOpen ? '-translate-x-10' : 'group-hover:-translate-x-10'
              }`}
            >
              {board.role}
            </Badge>
            
            {/* Dropdown menu that appears on hover */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 absolute right-0 transition-all duration-200 ease-in-out ${
                    isDropdownOpen 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction(() => onEditBoard(board.id), e)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Board
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction(() => onArchiveBoard(board.id), e)}
                >
                  {isArchived ? (
                    <>
                      <ArchiveRestore className="h-4 w-4 mr-2" />
                      Unarchive
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction(() => onManageTeam(board.id), e)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3" onClick={() => onBoardClick(board.id)}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{board.progress}%</span>
          </div>
          <Progress value={board.progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle2 className="h-3 w-3" />
            <span>{board.totalTasks - board.incompleteTasksCount}/{board.totalTasks} tasks</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{board.members}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant={board.incompleteTasksCount > 5 ? "destructive" : "secondary"}
            className="text-xs"
          >
            {board.incompleteTasksCount} pending
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>
              {isClient ? (
                isArchived ? 
                  `Completed ${new Date(board.dueDate).toLocaleDateString()}` :
                  `Due ${getDaysUntilDue(board.dueDate)} days`
              ) : "Loading..."}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
