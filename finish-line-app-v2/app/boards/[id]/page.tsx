"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Board } from "@/types/boards";
import { Task, TaskFormData } from "@/types/tasks";
import { getBoardByBoardCode } from "@/lib/supabase/boards";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { BoardColumns, BoardHeader } from "@/components/board-view";

export default function BoardViewPage() {
  const params = useParams();
  const router = useRouter();
  const isClient = useIsClient();
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
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

  // Prevent hydration mismatches
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser === board.admin;

  const handleAddTask = (status: string, taskData: TaskFormData) => {
    // Create a new task with a temporary ID
    const newTask: Task = {
      id: Date.now().toString(), // Temporary ID
      title: taskData.title,
      status,
      category: taskData.category,
      priority: taskData.priority,
      deadline: taskData.deadline,
      assignee: taskData.assignee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to local state
    setTasks(prev => [...prev, newTask]);
    
    // Log the task data (you can replace this with actual Supabase save later)
    console.log("Adding task:", newTask);
  };

  // Mock available users for now (you can replace with actual data later)
  const availableUsers = board?.allowed_users || [];

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
        tasks={tasks}
        categories={board.categories}
        availableUsers={availableUsers}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
