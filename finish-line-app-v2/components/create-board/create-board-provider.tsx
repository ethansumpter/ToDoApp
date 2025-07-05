"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CreateBoardModal } from "@/components/create-board/create-board-modal";
import { CreateBoardFormData } from "@/types/create-board";

interface CreateBoardContextType {
  openCreateBoard: () => void;
  closeCreateBoard: () => void;
  isOpen: boolean;
}

const CreateBoardContext = createContext<CreateBoardContextType | undefined>(undefined);

export function useCreateBoard() {
  const context = useContext(CreateBoardContext);
  if (!context) {
    throw new Error("useCreateBoard must be used within a CreateBoardProvider");
  }
  return context;
}

interface CreateBoardProviderProps {
  children: ReactNode;
  onBoardCreated?: (data: CreateBoardFormData) => void;
}

export function CreateBoardProvider({ children, onBoardCreated }: CreateBoardProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openCreateBoard = () => setIsOpen(true);
  const closeCreateBoard = () => setIsOpen(false);

  const handleSuccess = (data: CreateBoardFormData) => {
    onBoardCreated?.(data);
  };

  return (
    <CreateBoardContext.Provider value={{ openCreateBoard, closeCreateBoard, isOpen }}>
      {children}
      <CreateBoardModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
        onSuccess={handleSuccess}
      />
    </CreateBoardContext.Provider>
  );
}
