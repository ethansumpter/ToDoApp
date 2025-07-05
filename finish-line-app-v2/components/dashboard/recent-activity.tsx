import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ActivityItem {
  id: number;
  action: string;
  task: string;
  board: string;
  user: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
  onActivityClick?: (activityId: number) => void;
}

export function RecentActivity({ activities, onViewAll, onActivityClick }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-3 text-sm cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
            onClick={() => onActivityClick?.(activity.id)}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p>
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">"{activity.task}"</span>{" "}
                <span className="text-muted-foreground">in {activity.board}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full text-sm" size="sm" onClick={onViewAll}>
          View all activity
        </Button>
      </CardContent>
    </Card>
  );
}
