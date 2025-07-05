"use client";

import { useState } from "react";
import { BoardsHeader, BoardsSection } from "@/components/boards";
import { activeBoards, archivedBoards } from "@/lib/boards-data";
import { ProjectBoard } from "@/types/boards";

export default function BoardsPage() {
  const [activeProjectBoards, setActiveProjectBoards] = useState<ProjectBoard[]>(activeBoards);
  const [archivedProjectBoards, setArchivedProjectBoards] = useState<ProjectBoard[]>(archivedBoards);

  const handleEditBoard = (boardId: number) => {
    console.log("Editing board:", boardId);
  };

  const handleArchiveBoard = (boardId: number) => {
    const boardToArchive = activeProjectBoards.find(board => board.id === boardId);
    if (boardToArchive) {
      setActiveProjectBoards(prev => prev.filter(board => board.id !== boardId));
      setArchivedProjectBoards(prev => [...prev, { ...boardToArchive, status: 'archived' }]);
    }
  };

  const handleUnarchiveBoard = (boardId: number) => {
    const boardToUnarchive = archivedProjectBoards.find(board => board.id === boardId);
    if (boardToUnarchive) {
      setArchivedProjectBoards(prev => prev.filter(board => board.id !== boardId));
      setActiveProjectBoards(prev => [...prev, { ...boardToUnarchive, status: 'active' }]);
    }
  };

  const handleManageTeam = (boardId: number) => {
    console.log("Managing team for board:", boardId);
  };

  const handleBoardClick = (boardId: number) => {
    console.log("Opening board:", boardId);
    // TODO: In a real implementation, you would:
    // 1. Fetch the board's share code from the database
    // 2. Navigate to `/boards/${shareCode}`
    // For now, we'll show a placeholder since we're using dummy data
    alert(`Would navigate to board view for board ID: ${boardId}`);
  };

  return (
    <div className="space-y-6">
      <BoardsHeader />
      
      <BoardsSection
        title="Active Boards"
        subtitle={`${activeProjectBoards.length} active project${activeProjectBoards.length !== 1 ? 's' : ''}`}
        boards={activeProjectBoards}
        onBoardClick={handleBoardClick}
        onEditBoard={handleEditBoard}
        onArchiveBoard={handleArchiveBoard}
        onManageTeam={handleManageTeam}
        emptyMessage="No active boards found. Create your first project board to get started!"
        showAddCard={true}
      />

      <BoardsSection
        title="Archived Boards"
        subtitle={`${archivedProjectBoards.length} archived project${archivedProjectBoards.length !== 1 ? 's' : ''}`}
        boards={archivedProjectBoards}
        onBoardClick={handleBoardClick}
        onEditBoard={handleEditBoard}
        onArchiveBoard={handleUnarchiveBoard}
        onManageTeam={handleManageTeam}
        emptyMessage="No archived boards found."
        isArchived
      />
    </div>
  );
}