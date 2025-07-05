import { BoardCard } from "./board-card";
import { AddBoardCard } from "./add-board-card";
import { ProjectBoard } from "@/types/boards";

interface BoardsSectionProps {
  title: string;
  subtitle: string;
  boards: ProjectBoard[];
  onBoardClick: (boardId: number) => void;
  onEditBoard: (boardId: number) => void;
  onArchiveBoard: (boardId: number) => void;
  onManageTeam: (boardId: number) => void;
  emptyMessage: string;
  isArchived?: boolean;
  showAddCard?: boolean;
}

export function BoardsSection({
  title,
  subtitle,
  boards,
  onBoardClick,
  onEditBoard,
  onArchiveBoard,
  onManageTeam,
  emptyMessage,
  isArchived = false,
  showAddCard = false
}: BoardsSectionProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      {boards.length === 0 && !showAddCard ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {showAddCard && (
            <AddBoardCard />
          )}
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onBoardClick={onBoardClick}
              onEditBoard={onEditBoard}
              onArchiveBoard={onArchiveBoard}
              onManageTeam={onManageTeam}
              isArchived={isArchived}
            />
          ))}
        </div>
      )}
    </div>
  );
}
