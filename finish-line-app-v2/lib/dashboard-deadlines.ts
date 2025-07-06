import { ProjectBoard } from "@/types/boards";
import { UpcomingTask } from "@/components/dashboard/upcoming-tasks";

export function getUpcomingBoardDeadlines(boards: ProjectBoard[]): UpcomingTask[] {
  // Filter boards with deadlines and convert to UpcomingTask format
  const upcomingDeadlines = boards
    .filter(board => board.dueDate && board.status === "active")
    .map(board => ({
      id: board.id,
      title: `${board.name} deadline`,
      boardName: board.name,
      dueDate: board.dueDate,
      priority: getBoardPriority(board),
      assignee: board.role
    }))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return upcomingDeadlines;
}

function getBoardPriority(board: ProjectBoard): "high" | "medium" | "low" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(board.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determine priority based on days until due and progress
  if (diffDays <= 1 || (diffDays <= 3 && board.progress < 50)) {
    return "high";
  } else if (diffDays <= 7 || (diffDays <= 14 && board.progress < 75)) {
    return "medium";
  } else {
    return "low";
  }
}
