"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BoardsHeader, BoardsSection } from "@/components/boards";
import { CreateBoardProvider } from "@/components/create-board/create-board-provider";
import { ProjectBoard } from "@/types/boards";
import { CreateBoardFormData } from "@/types/create-board";
import { getUserProjectBoards } from "@/lib/dashboard-boards";
import { createClient } from "@/lib/supabase/client";

export default function BoardsPage() {
  const router = useRouter();
  const [activeProjectBoards, setActiveProjectBoards] = useState<ProjectBoard[]>([]);
  const [archivedProjectBoards, setArchivedProjectBoards] = useState<ProjectBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch user boards on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/auth/login");
          return;
        }
        
        setCurrentUserId(user.id);
        
        // Fetch user's boards and separate active from archived
        await refreshBoards(user.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Function to refresh boards
  const refreshBoards = async (userId?: string) => {
    try {
      const targetUserId = userId || currentUserId;
      if (!targetUserId) return;

      // Get all boards (both active and archived)
      const { getUserBoards } = await import("@/lib/supabase/boards");
      const allBoards = await getUserBoards(targetUserId);
      
      // Transform boards and separate by status
      const transformedBoards = await Promise.all(
        allBoards.map(async (board) => {
          const { transformBoardToProjectBoard } = await import("@/lib/dashboard-boards");
          return transformBoardToProjectBoard(board, targetUserId);
        })
      );
      
      const activeBoards = transformedBoards.filter(board => board.status === "active");
      const archivedBoards = transformedBoards.filter(board => board.status === "archived");
      
      setActiveProjectBoards(activeBoards);
      setArchivedProjectBoards(archivedBoards);
    } catch (error) {
      console.error("Error refreshing boards:", error);
    }
  };

  const handleEditBoard = (boardId: number) => {
    console.log("Editing board:", boardId);
    // TODO: Implement board editing functionality
  };

  const handleArchiveBoard = async (boardId: number) => {
    try {
      const { updateBoard } = await import("@/lib/supabase/boards");
      await updateBoard(boardId, { archived: true });
      
      // Refresh boards to reflect the change
      await refreshBoards();
    } catch (error) {
      console.error("Error archiving board:", error);
    }
  };

  const handleUnarchiveBoard = async (boardId: number) => {
    try {
      const { updateBoard } = await import("@/lib/supabase/boards");
      await updateBoard(boardId, { archived: false });
      
      // Refresh boards to reflect the change
      await refreshBoards();
    } catch (error) {
      console.error("Error unarchiving board:", error);
    }
  };

  const handleManageTeam = (boardId: number) => {
    console.log("Managing team for board:", boardId);
    // TODO: Implement team management functionality
  };

  const handleBoardClick = async (boardId: number) => {
    try {
      // Get the board's share code and navigate to it
      const { getBoardById } = await import("@/lib/supabase/boards");
      const board = await getBoardById(boardId);
      
      if (board) {
        router.push(`/boards/${board.b_code}`);
      } else {
        console.error("Board not found");
        // Refresh boards in case it was deleted
        await refreshBoards();
      }
    } catch (error) {
      console.error("Error navigating to board:", error);
    }
  };

  // Handle successful board creation
  const handleBoardCreated = async (data: CreateBoardFormData) => {
    console.log("Board created successfully:", data);
    // Refresh the boards list to include the new board
    await refreshBoards();
  };

  // Add refresh functionality when page regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (currentUserId) {
        refreshBoards();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentUserId]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <BoardsHeader />
        <div className="space-y-8">
          {/* Active Boards Loading */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Active Boards</h2>
              <p className="text-muted-foreground">Loading your projects...</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted/20 rounded-lg h-48 animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Archived Boards Loading */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Archived Boards</h2>
              <p className="text-muted-foreground">Loading archived projects...</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-muted/20 rounded-lg h-48 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CreateBoardProvider onBoardCreated={handleBoardCreated}>
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

        {archivedProjectBoards.length > 0 && (
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
        )}
      </div>
    </CreateBoardProvider>
  );
}