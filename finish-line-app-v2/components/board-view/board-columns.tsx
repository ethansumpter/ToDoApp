"use client";

import { BoardColumn } from "./board-column";
import { Task, TaskFormData } from "@/types/tasks";

interface BoardColumnsProps {
  statuses: string[];
  tasks?: Task[];
  categories?: string[];
  availableUsers?: string[];
  onAddTask?: (status: string, taskData: TaskFormData) => void;
  onTaskClick?: (task: Task) => void;
}

export function BoardColumns({ 
  statuses, 
  tasks = [], 
  categories = [], 
  availableUsers = [], 
  onAddTask,
  onTaskClick
}: BoardColumnsProps) {
  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="flex-1 min-h-0">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
        {statuses.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status] || []}
            categories={categories}
            availableUsers={availableUsers}
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}
