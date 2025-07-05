"use client";

import { BoardColumn } from "./board-column";

interface BoardColumnsProps {
  statuses: string[];
  onAddTask?: (status: string) => void;
}

export function BoardColumns({ statuses, onAddTask }: BoardColumnsProps) {
  return (
    <div className="flex-1 min-h-0">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
        {statuses.map((status, index) => (
          <BoardColumn
            key={status}
            status={status}
            taskCount={0}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </div>
  );
}
