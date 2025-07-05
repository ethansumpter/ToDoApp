"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardHeader,
  StatsCards,
  ProjectBoards,
  UpcomingTasks,
  RecentActivity
} from "@/components/dashboard";
import { 
  upcomingTasks, 
  recentActivity, 
  currentUser 
} from "@/lib/dashboard-data";
import { getUserProjectBoards } from "@/lib/dashboard-boards";
import { ProjectBoard } from "@/types/boards";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [userBoards, setUserBoards] = useState<ProjectBoard[]>([]);
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
        
        // Fetch user's boards
        const boards = await getUserProjectBoards(user.id);
        setUserBoards(boards);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Refresh boards when page regains focus (user comes back from other pages)
  useEffect(() => {
    const handleFocus = () => {
      if (currentUserId) {
        refreshBoards();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentUserId]);

  // Function to refresh boards (useful after creating new boards)
  const refreshBoards = async () => {
    if (currentUserId) {
      try {
        const boards = await getUserProjectBoards(currentUserId);
        setUserBoards(boards);
      } catch (error) {
        console.error("Error refreshing boards:", error);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalIncompleteThisWeek = upcomingTasks.length;
  const totalBoards = userBoards.length;
  const averageProgress = userBoards.length > 0 ? Math.round(
    userBoards.reduce((acc, board) => acc + board.progress, 0) / userBoards.length
  ) : 0;
  const totalMembers = userBoards.reduce((acc, board) => acc + board.members, 0);

  // Event handlers - in a real app, these would navigate or trigger modals
  const handleNewProject = () => {
    console.log("Creating new project...");
    router.push("/boards");
  };

  const handleViewAllBoards = () => {
    console.log("Viewing all boards...");
    router.push("/boards");
  };

  const handleBoardClick = async (boardId: number) => {
    console.log("Clicked board:", boardId);
    try {
      // Find the board and navigate to it using its share code
      const board = userBoards.find(b => b.id === boardId);
      if (board) {
        // We need to get the actual Board from the database to get the share code
        const { getBoardById } = await import("@/lib/supabase/boards");
        const fullBoard = await getBoardById(boardId);
        if (fullBoard) {
          router.push(`/boards/${fullBoard.b_code}`);
        } else {
          console.error("Board not found in database");
          // Refresh boards in case it was deleted
          await refreshBoards();
        }
      } else {
        console.error("Board not found in local state");
        await refreshBoards();
      }
    } catch (error) {
      console.error("Error navigating to board:", error);
    }
  };

  const handleEditBoard = async (boardId: number) => {
    console.log("Editing board:", boardId);
    // TODO: Implement board editing functionality
  };

  const handleArchiveBoard = async (boardId: number) => {
    console.log("Archiving board:", boardId);
    try {
      const { updateBoard } = await import("@/lib/supabase/boards");
      await updateBoard(boardId, { archived: true });
      // Refresh the boards list
      await refreshBoards();
    } catch (error) {
      console.error("Error archiving board:", error);
    }
  };

  const handleManageTeam = (boardId: number) => {
    console.log("Managing team for board:", boardId);
  };

  const handleViewAllTasks = () => {
    console.log("Viewing all tasks...");
  };

  const handleTaskClick = (taskId: number) => {
    console.log("Clicked task:", taskId);
  };

  const handleViewAllActivity = () => {
    console.log("Viewing all activity...");
  };

  const handleActivityClick = (activityId: number) => {
    console.log("Clicked activity:", activityId);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        userName={currentUser.name} 
        onNewProject={handleNewProject}
      />

      <StatsCards
        totalBoards={totalBoards}
        totalIncompleteThisWeek={totalIncompleteThisWeek}
        averageProgress={averageProgress}
        totalMembers={totalMembers}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProjectBoards
          boards={userBoards}
          loading={loading}
          onViewAll={handleViewAllBoards}
          onBoardClick={handleBoardClick}
          onEditBoard={handleEditBoard}
          onArchiveBoard={handleArchiveBoard}
          onManageTeam={handleManageTeam}
        />

        <div className="space-y-6">
          <UpcomingTasks
            tasks={upcomingTasks}
            onViewAll={handleViewAllTasks}
            onTaskClick={handleTaskClick}
          />

          <RecentActivity
            activities={recentActivity}
            onViewAll={handleViewAllActivity}
            onActivityClick={handleActivityClick}
          />
        </div>
      </div>
    </div>
  );
}