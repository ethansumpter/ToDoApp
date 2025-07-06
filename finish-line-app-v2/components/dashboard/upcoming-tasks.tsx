import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";

export interface UpcomingTask {
  id: number;
  title: string;
  boardName: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assignee: string;
}

interface UpcomingTasksProps {
  tasks: UpcomingTask[];
  onViewAll?: () => void;
  onTaskClick?: (taskId: number) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "default";
    case "low": return "secondary";
    default: return "default";
  }
};

const getDaysUntilDue = (dueDate: string) => {
  // Use a consistent date to avoid hydration mismatches
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Normalize to start of day
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDueDate = (dueDate: string) => {
  const daysUntil = getDaysUntilDue(dueDate);
  
  if (daysUntil < 0) {
    return {
      text: "Overdue",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    };
  } else if (daysUntil === 0) {
    return {
      text: "Today",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    };
  } else if (daysUntil === 1) {
    return {
      text: "Tomorrow",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    };
  } else {
    return {
      text: `${daysUntil} days`,
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
      borderColor: "border-muted"
    };
  }
};

export function UpcomingTasks({ tasks, onViewAll, onTaskClick }: UpcomingTasksProps) {
  const isClient = useIsClient();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.slice(0, 5).map((task) => {
          const daysUntil = isClient ? getDaysUntilDue(task.dueDate) : 0;
          const dateFormat = isClient ? formatDueDate(task.dueDate) : {
            text: "Loading...",
            color: "text-muted-foreground",
            bgColor: "bg-muted/20",
            borderColor: "border-muted"
          };
          
          return (
            <div 
              key={task.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border ${dateFormat.borderColor} ${dateFormat.bgColor}`}
              onClick={() => onTaskClick?.(task.id)}
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.boardName}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs px-1">
                    {task.priority}
                  </Badge>
                  <span className={`text-xs font-medium ${dateFormat.color}`}>
                    {dateFormat.text}
                  </span>
                </div>
              </div>
              {isClient && daysUntil <= 0 && (
                <AlertCircle className="h-4 w-4 text-red-500 mt-1" />
              )}
            </div>
          );
        })}
        <Button variant="ghost" className="w-full text-sm" size="sm" onClick={onViewAll}>
          View all tasks
        </Button>
      </CardContent>
    </Card>
  );
}
