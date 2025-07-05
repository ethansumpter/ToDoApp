"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCreateBoard } from "@/components/create-board/create-board-provider";

export function AddBoardCard() {
  const { openCreateBoard } = useCreateBoard();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 hover:border-primary/50 bg-muted/20 hover:bg-muted/40"
      onClick={openCreateBoard}
    >
      <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-foreground">Create New Board</h3>
          <p className="text-sm text-muted-foreground">
            Start a new project board to organize your tasks
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
