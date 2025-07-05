"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateBoard } from "@/components/create-board/create-board-provider";

export function BoardsHeader() {
  const { openCreateBoard } = useCreateBoard();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Boards</h1>
        <p className="text-muted-foreground">
          Manage and track all your project boards in one place
        </p>
      </div>
      <Button onClick={openCreateBoard} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Board
      </Button>
    </div>
  );
}
