import { Button } from "@/components/ui/button";
import { BoardCard } from "@/components/boards/board-card";
import { ProjectBoard } from "@/types/boards";

interface ProjectBoardsProps {
  boards: ProjectBoard[];
  onViewAll?: () => void;
  onBoardClick?: (boardId: number) => void;
  onEditBoard?: (boardId: number) => void;
  onArchiveBoard?: (boardId: number) => void;
  onManageTeam?: (boardId: number) => void;
}

export function ProjectBoards({ 
  boards, 
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
    </div>
  );
}
