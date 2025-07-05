"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BoardColumnProps {
  status: string;
  taskCount?: number;
  onAddTask?: (status: string) => void;
}

export function BoardColumn({ status, taskCount = 0, onAddTask }: BoardColumnProps) {
  const handleAddTask = () => {
    onAddTask?.(status);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{status}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {taskCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
        {/* Add task button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground border-dashed border-2 h-auto py-3 flex-shrink-0"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add task
        </Button>
        
        {/* Tasks will be rendered here */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {/* Placeholder for tasks */}
        </div>
      </CardContent>
    </Card>
  );
}
