"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Board } from "@/types/boards";
import { Task, TaskFormData } from "@/types/tasks";
import { getBoardByBoardCode } from "@/lib/supabase/boards";
import { createTask, getTasksByBoard } from "@/lib/supabase/tasks";
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
        
        // Load existing tasks for this board
        try {
          const existingTasks = await getTasksByBoard(boardData.id);
          const uiTasks: Task[] = existingTasks.map(task => ({
            id: task.id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            category: task.category,
            priority: task.priority,
            deadline: task.deadline,
            assignee: task.assignee, // Fixed typo
            createdAt: task.created_at,
            updatedAt: task.updated_at,
          }));
          setTasks(uiTasks);
        } catch (taskError) {
          console.error("Error loading tasks:", taskError);
          // Don't fail the entire board load if tasks fail to load
        }
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

  const handleAddTask = async (status: string, taskData: TaskFormData) => {
    console.log('handleAddTask called with:', { status, taskData });
    
    if (!board || !currentUser) {
      console.log('Missing board or currentUser:', { board: !!board, currentUser: !!currentUser });
      return;
    }

    try {
      // Create task in database
      const newTaskData = {
        title: taskData.title,
        category: taskData.category,
        status,
        created_by: currentUser, // UUID field
        assignee: taskData.assignee, // UUID field (fixed typo)
        deadline: taskData.deadline,
        board: board.id,
        priority: taskData.priority || 'medium',
      };

      console.log('About to create task with data:', newTaskData);

      const createdTask = await createTask(newTaskData);
      
      // Convert the database task to the Task type used by the UI
      const uiTask: Task = {
        id: createdTask.id.toString(),
        title: createdTask.title,
        description: createdTask.description,
        status: createdTask.status,
        category: createdTask.category,
        priority: createdTask.priority,
        deadline: createdTask.deadline,
        assignee: createdTask.assignee, // Fixed typo
        createdAt: createdTask.created_at,
        updatedAt: createdTask.updated_at,
      };

      // Add to local state
      setTasks(prev => [...prev, uiTask]);
      
      console.log("Task created successfully:", createdTask);
    } catch (error) {
      console.error("Error creating task:", error);
      // You might want to show an error notification to the user here
    }
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
