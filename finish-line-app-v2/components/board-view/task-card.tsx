"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Users, MoreHorizontal } from "lucide-react";
import { Task } from "@/types/tasks";
import { useState, useEffect } from "react";
import { getUserProfiles, formatUserDisplayName } from "@/lib/supabase/users";
import { UserProfile } from "@/types/user";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [assigneeName, setAssigneeName] = useState<string | null>(null);

  // Fetch assignee name if task has an assignee
  useEffect(() => {
    const fetchAssigneeName = async () => {
      if (task.assignee) {
        try {
          const profiles = await getUserProfiles([task.assignee]);
          if (profiles.length > 0) {
            setAssigneeName(formatUserDisplayName(profiles[0]));
          } else {
            setAssigneeName(task.assignee); // Fallback to ID if profile not found
          }
        } catch (error) {
          console.error('Error fetching assignee profile:', error);
          setAssigneeName(task.assignee); // Fallback to ID on error
        }
      } else {
        setAssigneeName(null);
      }
    };

    fetchAssigneeName();
  }, [task.assignee]);

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
      <CardContent className="p-3 space-y-3">
        {/* Header with Task Name */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-tight flex-1 text-foreground">
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

        {/* Badge Information */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Priority Badge */}
          {task.priority && (
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
              {capitalize(task.priority)}
            </Badge>
          )}

          {/* Category Badge */}
          {task.category && (
            <Badge variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {task.category}
            </Badge>
          )}

          {/* Deadline Badge */}
          {task.deadline && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(task.deadline)}
            </Badge>
          )}

          {/* Assignee Badge */}
          {task.assignee && assigneeName && (
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              <Users className="h-3 w-3 mr-1" />
              {assigneeName}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
