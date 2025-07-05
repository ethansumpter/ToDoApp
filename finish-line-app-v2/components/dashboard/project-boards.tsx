import { Button } from "@/components/ui/button";
import { BoardCard } from "@/components/boards/board-card";
import { ProjectBoard } from "@/types/boards";
import { Plus, FolderOpen } from "lucide-react";

interface ProjectBoardsProps {
  boards: ProjectBoard[];
  loading?: boolean;
  onViewAll?: () => void;
  onBoardClick?: (boardId: number) => void;
  onEditBoard?: (boardId: number) => void;
  onArchiveBoard?: (boardId: number) => void;
  onManageTeam?: (boardId: number) => void;
}

export function ProjectBoards({ 
  boards, 
  loading = false,
  onViewAll, 
  onBoardClick, 
  onEditBoard, 
  onArchiveBoard, 
  onManageTeam 
}: ProjectBoardsProps) {
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Project Boards</h2>
        <Button variant="outline" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-muted/20 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No boards yet</h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            Create your first project board to start organizing your tasks and collaborating with your team.
          </p>
          <Button onClick={onViewAll} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Board
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onBoardClick={onBoardClick || (() => {})}
              onEditBoard={onEditBoard || (() => {})}
              onArchiveBoard={onArchiveBoard || (() => {})}
              onManageTeam={onManageTeam || (() => {})}
            />
          ))}
        </div>
      )}
    </div>
  );
}
