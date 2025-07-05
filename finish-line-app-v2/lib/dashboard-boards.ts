import { Board, ProjectBoard } from "@/types/boards";
import { getTasksByBoard } from "@/lib/supabase/tasks";

/**
 * Transform a Board from the database into a ProjectBoard for dashboard display
 */
export async function transformBoardToProjectBoard(
  board: Board, 
  currentUserId: string
): Promise<ProjectBoard> {
  try {
    // Get tasks for this board to calculate progress
    const tasks = await getTasksByBoard(board.id);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => 
      task.status.toLowerCase() === 'done' || 
      task.status.toLowerCase() === 'completed'
    ).length;
    const incompleteTasksCount = totalTasks - completedTasks;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Determine user's role
    const isAdmin = board.admin === currentUserId;
    const role = isAdmin ? "Admin" : "Member";
    
    // Get member count (allowed users + pending users)
    const members = board.allowed_users.length + board.pending_users.length;
    
    return {
      id: board.id,
      name: board.title,
      description: board.description || "",
      incompleteTasksCount,
      totalTasks,
      role,
      progress,
      dueDate: board.deadline || "",
      members,
      subject: "General", // We don't have subject in Board, so default to General
      status: board.archived ? "archived" : "active",
      createdAt: board.created_at,
      updatedAt: board.updated_at,
    };
  } catch (error) {
    console.error("Error transforming board:", error);
    // Return a minimal board representation if transformation fails
    return {
      id: board.id,
      name: board.title,
      description: board.description || "",
      incompleteTasksCount: 0,
      totalTasks: 0,
      role: board.admin === currentUserId ? "Admin" : "Member",
      progress: 0,
      dueDate: board.deadline || "",
      members: board.allowed_users.length,
      subject: "General",
      status: board.archived ? "archived" : "active",
      createdAt: board.created_at,
      updatedAt: board.updated_at,
    };
  }
}

/**
 * Get all user boards and transform them for dashboard display
 */
export async function getUserProjectBoards(userId: string): Promise<ProjectBoard[]> {
  try {
    const { getUserBoards } = await import("@/lib/supabase/boards");
    const boards = await getUserBoards(userId);
    
    // Transform all boards in parallel
    const projectBoards = await Promise.all(
      boards.map(board => transformBoardToProjectBoard(board, userId))
    );
    
    // Filter out archived boards and sort by most recent
    return projectBoards
      .filter(board => board.status === "active")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error("Error fetching user project boards:", error);
    return [];
  }
}
