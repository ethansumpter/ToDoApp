"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Calendar, Tag, Users, X, Clock, Save, Loader2 } from "lucide-react";
import { Task } from "@/types/tasks";
import { getUserProfiles, formatUserDisplayName } from "@/lib/supabase/users";
import { UserProfile } from "@/types/user";
import { updateTask } from "@/lib/supabase/tasks";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function TaskDetails({ task, onClose, onTaskUpdate }: TaskDetailsProps) {
  const [assigneeName, setAssigneeName] = useState<string | null>(null);
  const [createdByName, setCreatedByName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Editable fields
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Animation state management
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Update local state when task prop changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(onClose, 300);
  };

  // Auto-save function
  const autoSave = async (field: 'title' | 'description', value: string) => {
    if (value === task[field]) return; // No change, don't save
    
    setIsSaving(true);
    try {
      const updates = { [field]: value };
      await updateTask(task.id, updates);
      
      // Update parent component with new task data
      if (onTaskUpdate) {
        const updatedTask = { ...task, [field]: value, updatedAt: new Date().toISOString() };
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      // Revert to original value on error
      if (field === 'title') setTitle(task.title);
      if (field === 'description') setDescription(task.description || '');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle title blur (save on blur)
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    autoSave('title', title);
  };

  // Handle description blur (save on blur)
  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    autoSave('description', description);
  };

  // Handle Enter key for title
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditingTitle(false);
    }
  };

  // Fetch user names if task has assignee or createdBy
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = [];
      if (task.assignee) userIds.push(task.assignee);
      if (task.createdBy) userIds.push(task.createdBy);
      
      if (userIds.length > 0) {
        try {
          const profiles = await getUserProfiles(userIds);
          
          // Set assignee name
          if (task.assignee) {
            const assigneeProfile = profiles.find(p => p.id === task.assignee);
            if (assigneeProfile) {
              setAssigneeName(formatUserDisplayName(assigneeProfile));
            } else {
              setAssigneeName(task.assignee);
            }
          }
          
          // Set created by name
          if (task.createdBy) {
            const createdByProfile = profiles.find(p => p.id === task.createdBy);
            if (createdByProfile) {
              setCreatedByName(formatUserDisplayName(createdByProfile));
            } else {
              setCreatedByName(task.createdBy);
            }
          }
        } catch (error) {
          console.error('Error fetching user profiles:', error);
          if (task.assignee) setAssigneeName(task.assignee);
          if (task.createdBy) setCreatedByName(task.createdBy);
        }
      }
    };

    fetchUserNames();
  }, [task.assignee, task.createdBy]);

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
            {/* Task Title - Editable */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isEditingTitle ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="text-xl font-semibold border-none shadow-none p-0 focus-visible:ring-1 focus-visible:ring-ring"
                    autoFocus
                  />
                ) : (
                  <h3 
                    className="text-xl font-semibold text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {title}
                  </h3>
                )}
                {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              
              {/* Status Badge */}
              <Badge variant="outline" className="mb-4">
                {task.status}
              </Badge>
            </div>

            {/* Description - Editable */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
              {isEditingDescription ? (
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  onBlur={handleDescriptionBlur}
                  placeholder="Add a description..."
                />
              ) : (
                <div
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 -mx-2 -my-1 transition-colors min-h-[40px] flex items-start"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description ? (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  ) : (
                    <span className="italic">No description provided. Click to add one.</span>
                  )}
                </div>
              )}
            </div>

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

                {/* Created by */}
                {task.createdBy && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created by</span>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      <Users className="h-3 w-3 mr-1" />
                      {createdByName || task.createdBy}
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
