"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateBoard } from "@/components/create-board/create-board-provider";

interface SidebarActionsProps {
  className?: string;
}

export function SidebarActions({ className }: SidebarActionsProps) {
  const { openCreateBoard } = useCreateBoard();

  return (
    <div className={cn("p-4 border-b", className)}>
      <Button className="w-full gap-2" size="sm" onClick={openCreateBoard}>
        <Plus className="h-4 w-4" />
        New Board
      </Button>
    </div>
  );
}
