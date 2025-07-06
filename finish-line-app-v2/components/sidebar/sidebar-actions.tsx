"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateBoard } from "@/components/create-board/create-board-provider";
import { JoinBoardModal } from "@/components/join-board";

interface SidebarActionsProps {
  className?: string;
}

export function SidebarActions({ className }: SidebarActionsProps) {
  const { openCreateBoard } = useCreateBoard();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className={cn("p-4 border-b space-y-2", className)}>
      <Button className="w-full gap-2" size="sm" onClick={openCreateBoard}>
        <Plus className="h-4 w-4" />
        New Board
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full gap-2" 
        size="sm" 
        onClick={() => setIsJoinModalOpen(true)}
      >
        <UserPlus className="h-4 w-4" />
        Join Board
      </Button>
      
      <JoinBoardModal 
        open={isJoinModalOpen} 
        onOpenChange={setIsJoinModalOpen} 
      />
    </div>
  );
}
