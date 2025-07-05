"use client";

import { useRouter } from "next/navigation";
import {
  DashboardHeader,
  StatsCards,
  ProjectBoards,
  UpcomingTasks,
  RecentActivity
} from "@/components/dashboard";
import { 
  userBoards, 
  upcomingTasks, 
  recentActivity, 
  currentUser 
} from "@/lib/dashboard-data";

export default function DashboardPage() {
  const router = useRouter();
  const totalIncompleteThisWeek = upcomingTasks.length;
  const totalBoards = userBoards.length;
  const averageProgress = Math.round(
    userBoards.reduce((acc, board) => acc + board.progress, 0) / userBoards.length
  );
  const totalMembers = userBoards.reduce((acc, board) => acc + board.members, 0);

  // Event handlers - in a real app, these would navigate or trigger modals
  const handleNewProject = () => {
    console.log("Creating new project...");
  };

  const handleViewAllBoards = () => {
    console.log("Viewing all boards...");
    router.push("/boards");
  };

  const handleBoardClick = (boardId: number) => {
    console.log("Clicked board:", boardId);
    // TODO: In a real implementation, you would:
    // 1. Fetch the board's share code from the database
    // 2. Navigate to `/boards/${shareCode}`
    // For now, we'll show a placeholder since we're using dummy data
    alert(`Would navigate to board view for board ID: ${boardId}`);
  };

  const handleEditBoard = (boardId: number) => {
    console.log("Editing board:", boardId);
  };

  const handleArchiveBoard = (boardId: number) => {
    console.log("Archiving board:", boardId);
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