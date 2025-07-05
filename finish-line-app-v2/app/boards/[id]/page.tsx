"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Board } from "@/types/boards";
import { getBoardByBoardCode } from "@/lib/supabase/boards";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Settings, ArrowLeft, Plus } from "lucide-react";
import { Icon } from "@/components/ui/icon-picker";
import { useIsClient } from "@/hooks/use-is-client";

interface BoardViewPageProps {}

export default function BoardViewPage() {
  const params = useParams();
  const router = useRouter();
  const isClient = useIsClient();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const boardCode = params.id as string;

  useEffect(() => {
    const fetchBoardAndUser = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        
        setCurrentUser(user.id);

        // Fetch board by share code
        const boardData = await getBoardByBoardCode(boardCode);
        
        if (!boardData) {
          setError("Board not found");
          setLoading(false);
          return;
        }

        // Check if user has access to this board
        const hasAccess = boardData.allowed_users.includes(user.id) || boardData.admin === user.id;
        
        if (!hasAccess) {
          setError("You don't have permission to access this board");
          setLoading(false);
          return;
        }

        setBoard(boardData);
      } catch (err) {
        console.error("Error fetching board:", err);
        setError("Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    if (boardCode && boardCode !== 'undefined') {
      fetchBoardAndUser();
    } else {
      setError("Invalid board link");
      setLoading(false);
    }
  }, [boardCode, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load board</h2>
          <p className="text-muted-foreground mb-4">{error || "Board not found"}</p>
          <Button onClick={() => router.push("/boards")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser === board.admin;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Board Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/boards")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Button>
          <div className="flex items-center gap-3">
            {board.icon && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={board.icon as any} className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{board.title}</h1>
              <p className="text-sm text-muted-foreground">
                Share Code: <span className="font-mono">{board.b_code}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {board.allowed_users.length} member{board.allowed_users.length !== 1 ? 's' : ''}
          </Badge>
          {board.deadline && (
            <Badge variant="outline">
              <CalendarDays className="h-3 w-3 mr-1" />
              Due {isClient ? new Date(board.deadline).toLocaleDateString() : "Loading..."}
            </Badge>
          )}
          {isAdmin && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Board Settings
            </Button>
          )}
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
          {board.statuses.map((status, index) => (
            <Card key={status} className="flex flex-col h-full">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{status}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    0
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
                {/* Add task button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground border-dashed border-2 h-auto py-3 flex-shrink-0"
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
          ))}
        </div>
      </div>
    </div>
  );
}
