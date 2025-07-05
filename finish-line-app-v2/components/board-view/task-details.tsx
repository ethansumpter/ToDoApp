"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Users, X, Clock } from "lucide-react";
import { Task } from "@/types/tasks";
import { getUserProfiles, formatUserDisplayName } from "@/lib/supabase/users";
import { UserProfile } from "@/types/user";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const [assigneeName, setAssigneeName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation state management
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(onClose, 300);
  };

  // Fetch assignee name if task has an assignee
  useEffect(() => {
    const fetchAssigneeName = async () => {
      if (task.assignee) {
        try {
          const profiles = await getUserProfiles([task.assignee]);
          if (profiles.length > 0) {
            setAssigneeName(formatUserDisplayName(profiles[0]));
          } else {
            setAssigneeName(task.assignee);
          }
        } catch (error) {
          console.error('Error fetching assignee profile:', error);
          setAssigneeName(task.assignee);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop - left side */}
      <div 
        className={`flex-1 cursor-pointer transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Task Details Panel - right side */}
      <div 
        className={`w-1/2 bg-background border-l shadow-2xl flex flex-col h-full transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ margin: 0, padding: 0 }}
      >
        <div className="flex-1 flex flex-col">
          <div className="flex-shrink-0 border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Task Title */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {task.title}
              </h3>
              
              {/* Status Badge */}
              <Badge variant="outline" className="mb-4">
                {task.status}
              </Badge>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Task Properties */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Properties</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {/* Priority */}
                {task.priority && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {capitalize(task.priority)}
                    </Badge>
                  </div>
                )}

                {/* Category */}
                {task.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {task.category}
                    </Badge>
                  </div>
                )}

                {/* Assignee */}
                {task.assignee && assigneeName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assigned to</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Users className="h-3 w-3 mr-1" />
                      {assigneeName}
                    </Badge>
                  </div>
                )}

                {/* Deadline */}
                {task.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(task.deadline)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Timeline</h4>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDateTime(task.createdAt)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last updated</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDateTime(task.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
