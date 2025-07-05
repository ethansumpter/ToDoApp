"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Board } from "@/types/boards";
import { getBoardByBoardCode } from "@/lib/supabase/boards";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { BoardColumns, BoardHeader } from "@/components/board-view";

interface BoardViewPageProps {}

export default function BoardViewPage() {
  const params = useParams();
  const router = useRouter();
  const isClient = useIsClient();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const boardCode = params.id as string;

  useEffect(() => {
    const fetchBoardAndUser = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        
        setCurrentUser(user.id);

        // Fetch board by share code
        const boardData = await getBoardByBoardCode(boardCode);
        
        if (!boardData) {
          setError("Board not found");
          setLoading(false);
          return;
        }

        // Check if user has access to this board
        const hasAccess = boardData.allowed_users.includes(user.id) || boardData.admin === user.id;
        
        if (!hasAccess) {
          setError("You don't have permission to access this board");
          setLoading(false);
          return;
        }

        setBoard(boardData);
      } catch (err) {
        console.error("Error fetching board:", err);
        setError("Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    if (boardCode && boardCode !== 'undefined') {
      fetchBoardAndUser();
    } else {
      setError("Invalid board link");
      setLoading(false);
    }
  }, [boardCode, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load board</h2>
          <p className="text-muted-foreground mb-4">{error || "Board not found"}</p>
          <Button onClick={() => router.push("/boards")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser === board.admin;

  const handleAddTask = (status: string) => {
    console.log("Adding task to status:", status);
    // TODO: Implement add task functionality
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Board Header */}
      <BoardHeader
        title={board.title}
        shareCode={board.b_code}
        icon={board.icon}
        allowedUsersCount={board.allowed_users.length}
        deadline={board.deadline}
        isAdmin={isAdmin}
        onBackClick={() => router.push("/boards")}
        onSettingsClick={() => {
          console.log("Opening board settings...");
          // TODO: Implement board settings functionality
        }}
      />

      {/* Board Columns */}
      <BoardColumns 
        statuses={board.statuses} 
        onAddTask={handleAddTask}
      />
    </div>
  );
}
