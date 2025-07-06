"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users } from "lucide-react";

interface JoinBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinBoardModal({ open, onOpenChange }: JoinBoardModalProps) {
  const [boardCode, setBoardCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [open]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (sanitizedValue.length <= 1) {
      const newBoardCode = [...boardCode];
      newBoardCode[index] = sanitizedValue;
      setBoardCode(newBoardCode);

      // Auto-focus next input if character was entered
      if (sanitizedValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !boardCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        const newBoardCode = [...boardCode];
        
        for (let i = 0; i < 6; i++) {
          newBoardCode[i] = cleanText[i] || '';
        }
        
        setBoardCode(newBoardCode);
        
        // Focus the next empty input or the last input
        const nextIndex = Math.min(cleanText.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleJoinBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fullBoardCode = boardCode.join('');
    
    if (fullBoardCode.length !== 6) {
      toast({
        title: "Incomplete board code",
        description: "Please enter all 6 characters of the board code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First, check if the board exists
      const { getBoardByBoardCode } = await import("@/lib/supabase/boards");
      const board = await getBoardByBoardCode(fullBoardCode);
      
      if (!board) {
        toast({
          title: "Board not found",
          description: "No board found with that code. Please check the code and try again.",
          variant: "destructive",
        });
        return;
      }

      // Get current user
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join a board.",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already a member
      if (board.allowed_users.includes(user.id)) {
        toast({
          title: "Already a member",
          description: "You are already a member of this board.",
          variant: "default",
        });
        // Navigate to the board
        router.push(`/boards/${board.b_code}`);
        onOpenChange(false);
        return;
      }

      // Check if user already has a pending request
      if (board.pending_users.includes(user.id)) {
        toast({
          title: "Request pending",
          description: "Your request to join this board is still pending approval.",
          variant: "default",
        });
        onOpenChange(false);
        return;
      }

      // Add user to pending users
      const { updateBoard } = await import("@/lib/supabase/boards");
      await updateBoard(board.id, {
        pending_users: [...board.pending_users, user.id]
      });

      toast({
        title: "Join request sent",
        description: "Your request to join the board has been sent to the board admin.",
        variant: "default",
      });
      
      setBoardCode(["", "", "", "", "", ""]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error joining board:", error);
      toast({
        title: "Error joining board",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setBoardCode(["", "", "", "", "", ""]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Join Board
          </DialogTitle>
          <DialogDescription>
            Enter the board code to request access to join a board.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleJoinBoard} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="boardCode">Board Code</Label>
            <div className="flex gap-2 justify-center">
              {boardCode.map((char, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={char}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-12 text-center font-mono font-bold uppercase"
                  style={{ fontSize: '24px' }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Ask your team member for the 6-character board code to join their board.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your request will be sent to the board admin for approval.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Joining..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
