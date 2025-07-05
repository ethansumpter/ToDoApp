"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateBoardForm } from "./create-board-form";
import { CreateBoardFormData } from "@/types/create-board";
import { useIsClient } from "@/hooks/use-is-client";
import { createBoard } from "@/lib/supabase/boards";

interface CreateBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: CreateBoardFormData) => void;
}

export function CreateBoardModal({ open, onOpenChange, onSuccess }: CreateBoardModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isClient = useIsClient();
  const router = useRouter();

  const handleSubmit = async (data: CreateBoardFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Creating board with data:", data);
      
      // Save to Supabase
      const newBoard = await createBoard(data);
      console.log("Board created successfully:", newBoard);
      
      // Call success callback if provided
      onSuccess?.(data);
      
      // Close modal
      onOpenChange(false);
      
      // Navigate to the newly created board
      router.push(`/boards/${newBoard.b_code}`);
    } catch (error) {
      console.error("Error creating board:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create board";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Don't render the modal on the server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[70vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Error creating board</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="mt-4">
          <CreateBoardForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
