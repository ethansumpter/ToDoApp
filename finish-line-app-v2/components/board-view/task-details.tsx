"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { NoSSR } from "@/components/no-ssr";
import { Calendar as CalendarIcon, Tag, Users, X, Clock, Save, Loader2, AlertCircle } from "lucide-react";
import { Task } from "@/types/tasks";
import { getUserProfiles, formatUserDisplayName } from "@/lib/supabase/users";
import { UserProfile } from "@/types/user";
import { updateTask } from "@/lib/supabase/tasks";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onTaskUpdate?: (updatedTask: Task) => void;
  statuses?: string[];
  categories?: string[];
  availableUsers?: string[];
}

export function TaskDetails({ task, onClose, onTaskUpdate, statuses = [], categories = [], availableUsers = [] }: TaskDetailsProps) {
  const [assigneeName, setAssigneeName] = useState<string | null>(null);
  const [createdByName, setCreatedByName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  
  // Editable fields
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dropdown states
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false);

  // Animation state management
  useEffect(() => {
    // Mount the component immediately
    setIsMounted(true);
    
    // Small delay to ensure the DOM is ready and the transition can be seen
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  // Update local state when task prop changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Auto-save function
  const autoSave = async (field: string, value: string | undefined) => {
    // Handle comparison properly for undefined/null values
    const currentValue = (task as any)[field];
    const normalizedValue = value === undefined ? null : value;
    const normalizedCurrentValue = currentValue === undefined ? null : currentValue;
    
    if (normalizedValue === normalizedCurrentValue) return; // No change, don't save
    
    setIsSaving(true);
    try {
      // Convert undefined to null for database operations
      const dbValue = value === undefined ? null : value;
      const updates = { [field]: dbValue };
      await updateTask(task.id, updates);
      
      // Update parent component with new task data
      if (onTaskUpdate) {
        const updatedTask = { ...task, [field]: value, updatedAt: new Date().toISOString() };
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Property update handlers
  const handleStatusChange = (newStatus: string) => {
    autoSave('status', newStatus);
    setIsStatusOpen(false);
  };

  const handlePriorityChange = (newPriority: string | undefined) => {
    autoSave('priority', newPriority);
    setIsPriorityOpen(false);
  };

  const handleCategoryChange = (newCategory: string | undefined) => {
    autoSave('category', newCategory);
    setIsCategoryOpen(false);
  };

  const handleAssigneeChange = (newAssignee: string | undefined) => {
    autoSave('assignee', newAssignee);
    setIsAssigneeOpen(false);
  };

  const handleDeadlineChange = (newDeadline: Date | undefined) => {
    const deadlineString = newDeadline?.toISOString().split('T')[0];
    autoSave('deadline', deadlineString);
    setIsDeadlineOpen(false);
  };

  // Handle title blur (save on blur)
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title === task.title) return; // No change, don't save
    
    setIsSaving(true);
    updateTask(task.id, { title })
      .then(() => {
        if (onTaskUpdate) {
          const updatedTask = { ...task, title, updatedAt: new Date().toISOString() };
          onTaskUpdate(updatedTask);
        }
      })
      .catch((error) => {
        console.error('Error saving task:', error);
        setTitle(task.title); // Revert on error
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // Handle description blur (save on blur)
  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (description === (task.description || '')) return; // No change, don't save
    
    setIsSaving(true);
    updateTask(task.id, { description })
      .then(() => {
        if (onTaskUpdate) {
          const updatedTask = { ...task, description, updatedAt: new Date().toISOString() };
          onTaskUpdate(updatedTask);
        }
      })
      .catch((error) => {
        console.error('Error saving task:', error);
        setDescription(task.description || ''); // Revert on error
      })
      .finally(() => {
        setIsSaving(false);
      });
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
              setAssigneeName(task.assignee); // Keep as fallback for now, will be handled by getDisplayName
            }
          }
          
          // Set created by name  
          if (task.createdBy) {
            const createdByProfile = profiles.find(p => p.id === task.createdBy);
            if (createdByProfile) {
              setCreatedByName(formatUserDisplayName(createdByProfile));
            } else {
              setCreatedByName(task.createdBy); // Keep as fallback for now, will be handled by getDisplayName
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

  // Fetch user profiles for all available users
  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (availableUsers.length > 0) {
        try {
          const profiles = await getUserProfiles(availableUsers);
          setUserProfiles(profiles);
        } catch (error) {
          console.error('Error fetching user profiles:', error);
        }
      }
    };

    fetchUserProfiles();
  }, [availableUsers]);

  // Helper function to format user display name
  const getDisplayName = (userId: string): string => {
    const profile = userProfiles.find(p => p.id === userId);
    if (profile) {
      return formatUserDisplayName(profile);
    }
    // Better fallback - try to format the user ID as a name
    // This could be an email address, so extract the part before @
    if (userId.includes('@')) {
      return userId.split('@')[0];
    }
    return userId;
  };

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

  // Don't render until component is mounted to ensure proper animation
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop - left side */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={handleClose}
      />
      
      {/* Task Details Panel - right side */}
      <div 
        className={`w-1/4 bg-background border-l shadow-2xl flex flex-col h-full transition-transform duration-300 ease-in-out ${
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
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Popover open={isStatusOpen} onOpenChange={setIsStatusOpen}>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors">
                        <Badge variant="outline" className="border-none">
                          {task.status}
                        </Badge>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 z-[10000]">
                      <div className="space-y-1">
                        {statuses.map((status) => (
                          <Button
                            key={status}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-xs ${task.status === status ? 'bg-accent text-accent-foreground' : ''}`}
                            onClick={() => handleStatusChange(status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Popover open={isPriorityOpen} onOpenChange={setIsPriorityOpen}>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors">
                        {task.priority ? (
                          <Badge variant="outline" className={`border-none ${getPriorityColor(task.priority)}`}>
                            {capitalize(task.priority)}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No priority</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2 z-[10000]">
                      <div className="space-y-1">
                        {['low', 'medium', 'high'].map((p) => (
                          <Button
                            key={p}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-xs ${task.priority === p ? 'bg-accent text-accent-foreground' : ''}`}
                            onClick={() => handlePriorityChange(p)}
                          >
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(p)}`}>
                              {capitalize(p)}
                            </Badge>
                          </Button>
                        ))}
                        <div className="border-t border-border my-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-xs ${!task.priority ? 'bg-accent text-accent-foreground' : ''}`}
                          onClick={() => handlePriorityChange(undefined)}
                        >
                          No priority
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors">
                        {task.category ? (
                          <Badge variant="secondary" className="text-xs border-none">
                            <Tag className="h-3 w-3 mr-1" />
                            {task.category}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No category</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 z-[10000]">
                      <div className="space-y-1">
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-xs ${task.category === cat ? 'bg-accent text-accent-foreground' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                          >
                            {cat}
                          </Button>
                        ))}
                        {categories.length > 0 && (
                          <div className="border-t border-border my-1" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-xs ${!task.category ? 'bg-accent text-accent-foreground' : ''}`}
                          onClick={() => handleCategoryChange(undefined)}
                        >
                          No category
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Assignee */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assigned to</span>
                  <Popover open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors">
                        {task.assignee ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Users className="h-3 w-3 mr-1" />
                            {getDisplayName(task.assignee)}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 z-[10000]">
                      <div className="space-y-1">
                        {availableUsers.map((userId) => (
                          <Button
                            key={userId}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-xs ${task.assignee === userId ? 'bg-accent text-accent-foreground' : ''}`}
                            onClick={() => handleAssigneeChange(userId)}
                          >
                            {getDisplayName(userId)}
                          </Button>
                        ))}
                        {availableUsers.length > 0 && (
                          <div className="border-t border-border my-1" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-xs ${!task.assignee ? 'bg-accent text-accent-foreground' : ''}`}
                          onClick={() => handleAssigneeChange(undefined)}
                        >
                          Unassigned
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <Popover open={isDeadlineOpen} onOpenChange={setIsDeadlineOpen}>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors">
                        {task.deadline ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(task.deadline)}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No deadline</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0 z-[10000]" align="start">
                      <div className="p-3">
                        <NoSSR>
                          <Calendar
                            mode="single"
                            selected={task.deadline ? new Date(task.deadline) : undefined}
                            onSelect={handleDeadlineChange}
                            initialFocus
                            className="w-full"
                          />
                        </NoSSR>
                        {task.deadline && (
                          <div className="pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => handleDeadlineChange(undefined)}
                            >
                              Clear deadline
                            </Button>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
            </div>

            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Timeline</h4>
              
            {/* Created by */}
                {task.createdBy && (
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created by</span>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <Users className="h-3 w-3 mr-1" />
                        {getDisplayName(task.createdBy)}
                    </Badge>
                    </div>
                )}
            

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created on</span>
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
