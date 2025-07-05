"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryManager } from "./category-manager";
import { StatusManager } from "./status-manager";
import { CreateBoardFormData } from "@/types/create-board";
import { CalendarDays, Save, X } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { IconPicker, Icon, IconName } from "@/components/ui/icon-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  title: z.string().min(1, "Board title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
  deadline: z.string().min(1, "Deadline is required"),
  icon: z.string().min(1, "Board icon is required"),
  taskCategories: z.array(z.string()).min(1, "At least one task category is required"),
  taskStatuses: z.array(z.string()).min(3, "At least three task statuses are required"),
});

interface CreateBoardFormProps {
  onSubmit: (data: CreateBoardFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultCategories = ["Research", "Development", "Testing", "Documentation", "Presentation"];
const defaultStatuses = ["To Do", "In Progress", "Review", "Done"];

export function CreateBoardForm({ onSubmit, onCancel, isLoading = false }: CreateBoardFormProps) {
  const [selectedIcon, setSelectedIcon] = useState<IconName>("square-kanban");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [statuses, setStatuses] = useState<string[]>(defaultStatuses);
  const isClient = useIsClient();

  // Get today's date in a way that's consistent between server and client
  const today = isClient ? new Date().toISOString().split('T')[0] : "2025-06-30";

  const form = useForm<CreateBoardFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      icon: selectedIcon,
      taskCategories: categories,
      taskStatuses: statuses,
    },
  });

  const handleFormSubmit = (data: CreateBoardFormData) => {
    const formData = {
      ...data,
      icon: selectedIcon,
      taskCategories: categories,
      taskStatuses: statuses,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconPicker value={selectedIcon} onValueChange={setSelectedIcon}>
                        <Button variant="outline" size="lg" className="h-10 w-10 p-0 hover:scale-105 transition-transform">
                          <Icon name={selectedIcon} className="h-5 w-5" />
                        </Button>
                      </IconPicker>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select an icon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                Board Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Name your board..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project..." 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Deadline</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          {...field}
                          min={today}
                        />
                        <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryManager 
                  categories={categories}
                  onCategoriesChange={setCategories}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Statuses</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusManager 
                  statuses={statuses}
                  onStatusesChange={setStatuses}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Board"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
