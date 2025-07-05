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
  onTaskMove?: (taskId: string, sourceStatus: string, targetStatus: string) => void;
}

export function BoardColumn({ 
  status, 
  tasks = [], 
  categories = [], 
  availableUsers = [], 
  onAddTask,
  onTaskClick,
  onTaskMove
}: BoardColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { taskId, sourceStatus } = data;
      
      if (sourceStatus !== status && onTaskMove) {
        onTaskMove(taskId, sourceStatus, status);
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
    
    setDraggedTask(null);
  };

  const handleTaskDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  return (
    <Card 
      className={`flex flex-col h-full transition-all ${
        isDragOver ? 'ring-2 ring-primary ring-opacity-50 bg-accent/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
              isDragging={draggedTask === task.id}
              onDragStart={handleTaskDragStart}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
