"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { NoSSR } from "@/components/no-ssr";
import { 
  Calendar as CalendarIcon, 
  Tag, 
  Users, 
  AlertCircle, 
  Check
} from "lucide-react";
import { AddTaskProps, TaskFormData } from "@/types/tasks";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getUserProfiles, formatUserDisplayName } from "@/lib/supabase/users";
import { UserProfile } from "@/types/user";

export function AddTaskInline({ 
  onSave, 
  onCancel, 
  categories, 
  availableUsers 
}: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | undefined>();
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [assignee, setAssignee] = useState<string | undefined>();
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useUserProfile();

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
    // Fallback to current user if it's them
    if (userProfile && userProfile.id === userId) {
      return `${userProfile.first_name} ${userProfile.last_name.charAt(0)}.`;
    }
    // Last resort: return the user ID
    return userId;
  };

  // Handle click outside to cancel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't cancel if clicking on the card itself
      if (cardRef.current && cardRef.current.contains(target)) {
        return;
      }
      
      // Don't cancel if clicking on a popover content (they have data-radix-popper-content-wrapper)
      const popoverContent = (target as Element).closest('[data-radix-popper-content-wrapper]');
      if (popoverContent) {
        return;
      }
      
      // Don't cancel if clicking on any popover-related element
      const popoverElement = (target as Element).closest('[role="dialog"], [data-state="open"]');
      if (popoverElement) {
        return;
      }
      
      onCancel();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const taskData: TaskFormData = {
      title: title.trim(),
      category,
      priority, // Allow priority to be undefined/null
      deadline: deadline?.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
      assignee
    };
    
    onSave(taskData);
    
    // Reset form
    setTitle("");
    setCategory(undefined);
    setPriority(undefined);
    setDeadline(undefined);
    setAssignee(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);  return (
    <Card ref={cardRef} className="border-2 border-dashed border-primary/50 bg-primary/5">
      <CardContent className="p-3 space-y-3">        {/* Title Input */}
        <Input
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-none shadow-none p-0 text-sm font-medium placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
          autoFocus
        />

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 w-7 p-0 relative ${category ? 'text-white hover:text-white' : 'hover:text-current'}`}
                >
                  <div className={`absolute inset-0 flex items-center justify-center ${category ? 'bg-black rounded-full' : ''}`}>
                    <Tag className="h-3 w-3" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-xs ${category === cat ? 'bg-accent text-accent-foreground' : ''}`}
                      onClick={() => setCategory(cat)}
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
                    className={`w-full justify-start text-xs ${!category ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setCategory(undefined)}
                  >
                    No category
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Priority */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 w-7 p-0 relative ${priority ? 'text-white hover:text-white' : 'hover:text-current'}`}
                >
                  <div className={`absolute inset-0 flex items-center justify-center ${priority ? 'bg-black rounded-full' : ''}`}>
                    <AlertCircle className="h-3 w-3" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-2">
                <div className="space-y-1">
                  {['low', 'medium', 'high'].map((p) => (
                    <Button
                      key={p}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-xs ${priority === p ? 'bg-accent text-accent-foreground' : ''}`}
                      onClick={() => setPriority(p as 'low' | 'medium' | 'high')}
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
                    className={`w-full justify-start text-xs ${!priority ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setPriority(undefined)}
                  >
                    No priority
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Deadline */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 w-7 p-0 relative ${deadline ? 'text-white hover:text-white' : 'hover:text-current'}`}
                >
                  <div className={`absolute inset-0 flex items-center justify-center ${deadline ? 'bg-black rounded-full' : ''}`}>
                    <CalendarIcon className="h-3 w-3" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0" align="start">
                <div className="p-3">
                  <NoSSR>
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      className="w-full"
                    />
                  </NoSSR>
                  {deadline && (
                    <div className="pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setDeadline(undefined)}
                      >
                        Clear date
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Assignee */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 w-7 p-0 relative ${assignee ? 'text-white hover:text-white' : 'hover:text-current'}`}
                >
                  <div className={`absolute inset-0 flex items-center justify-center ${assignee ? 'bg-black rounded-full' : ''}`}>
                    <Users className="h-3 w-3" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="space-y-1">
                  {availableUsers.map((userId) => (
                    <Button
                      key={userId}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-xs ${assignee === userId ? 'bg-accent text-accent-foreground' : ''}`}
                      onClick={() => setAssignee(userId)}
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
                    className={`w-full justify-start text-xs ${!assignee ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setAssignee(undefined)}
                  >
                    Unassigned
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Add Task Button */}
            <Button
              size="sm"
              className="h-7 text-xs ml-auto"
              onClick={handleSave}
              disabled={!title.trim()}
            >
              <Check className="h-3 w-3 mr-1" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
