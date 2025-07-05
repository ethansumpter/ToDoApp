"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddTaskInline } from "./add-task-inline";
import { TaskCard } from "./task-card";
import { Task, TaskFormData } from "@/types/tasks";

interface BoardColumnProps {
  status: string;
  tasks?: Task[];
  categories?: string[];
  availableUsers?: string[];
  onAddTask?: (status: string, taskData: TaskFormData) => void;
  onTaskClick?: (task: Task) => void;
}

export function BoardColumn({ 
  status, 
  tasks = [], 
  categories = [], 
  availableUsers = [], 
  onAddTask,
  onTaskClick
}: BoardColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    setIsAddingTask(true);
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    onAddTask?.(status, taskData);
    setIsAddingTask(false);
  };

  const handleCancelTask = () => {
    setIsAddingTask(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{status}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
        {/* Add task button or inline form */}
        {isAddingTask ? (
          <AddTaskInline
            status={status}
            onSave={handleSaveTask}
            onCancel={handleCancelTask}
            categories={categories}
            availableUsers={availableUsers}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground border-dashed border-2 h-auto py-3 flex-shrink-0"
            onClick={handleAddTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add task
          </Button>
        )}
        
        {/* Tasks */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
