"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Users, MoreHorizontal } from "lucide-react";
import { Task } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow group">
      <CardContent className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight flex-1">
            {task.title}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu actions
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Priority */}
          {task.priority && (
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
              {capitalize(task.priority)}
            </Badge>
          )}
        </div>

        {/* Footer Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Category */}
            {task.category && (
              <button className="relative cursor-pointer">
                <div className="bg-black rounded-full p-1">
                  <Tag className="h-3 w-3 text-white" />
                </div>
              </button>
            )}

            {/* Deadline */}
            {task.deadline && (
              <button className="relative cursor-pointer">
                <div className="bg-black rounded-full p-1">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
              </button>
            )}

            {/* Assignee */}
            {task.assignee && (
              <button className="relative cursor-pointer">
                <div className="bg-black rounded-full p-1">
                  <Users className="h-3 w-3 text-white" />
                </div>
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
