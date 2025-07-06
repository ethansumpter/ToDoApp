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
import { toast } from "sonner";
import { UserPlus, Users } from "lucide-react";

interface JoinBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinBoardModal({ open, onOpenChange }: JoinBoardModalProps) {
  const [boardCode, setBoardCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [open]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow alphanumeric characters and convert to lowercase
    const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    
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
        const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
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
      toast.error("Please enter all 6 characters of the board code.");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting to join board with code:", fullBoardCode);
      
      // Get current user first
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log("Current user:", user?.id);
      
      if (!user) {
        toast.error("Please log in to join a board.", {
          style: { zIndex: 9999 },
        });
        setIsLoading(false);
        return;
      }

      // Try to find the board using direct query
      console.log("Querying board with code:", fullBoardCode);
      const { data: boards, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('b_code', fullBoardCode);

      console.log("Board query result:", { boards, boardError });
      
      if (boardError) {
        console.error("Board query error:", boardError);
        console.error("Error details:", JSON.stringify(boardError, null, 2));
        
        toast.error(`Database error: ${boardError.message || 'Unknown error'}`, {
          style: { zIndex: 9999 },
        });
        setIsLoading(false);
        return;
      }

      if (!boards || boards.length === 0) {
        console.log("No boards found with that code");
        toast.error("No board exists with that code. Please double-check the 6-character code and try again.", {
          style: { zIndex: 99999 },
        });
        setIsLoading(false);
        return;
      }

      const board = boards[0];
      console.log("Found board:", board);

      // Check if user is already a member
      if (board.allowed_users && board.allowed_users.includes(user.id)) {
        toast.success("You are already a member of this board.", {
          style: { zIndex: 9999 },
        });
        // Navigate to the board
        router.push(`/boards/${board.b_code}`);
        setTimeout(() => {
          onOpenChange(false);
        }, 100);
        setIsLoading(false);
        return;
      }

      // Check if user already has a pending request
      if (board.pending_users && board.pending_users.includes(user.id)) {
        toast.info("Your request to join this board is still pending approval.", {
          style: { zIndex: 9999 },
        });
        setTimeout(() => {
          onOpenChange(false);
        }, 100);
        setIsLoading(false);
        return;
      }

      // Add user to pending users using direct update
      const updatedPendingUsers = board.pending_users ? [...board.pending_users, user.id] : [user.id];
      
      console.log("Updating pending users:", updatedPendingUsers);
      
      const { error: updateError } = await supabase
        .from('boards')
        .update({ pending_users: updatedPendingUsers })
        .eq('id', board.id);

      if (updateError) {
        console.error("Error updating board:", updateError);
        toast.error("There was an error processing your request. Please try again.", {
          style: { zIndex: 9999 },
        });
        setIsLoading(false);
        return;
      }

      console.log("Successfully added user to pending users");

      toast.success("Your request to join the board has been sent to the board admin for approval.", {
        style: { zIndex: 9999 },
      });
      
      console.log("Toast notification triggered");
      
      setBoardCode(["", "", "", "", "", ""]);
      
      // Add a small delay before closing the modal to ensure toast shows
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } catch (error) {
      console.error("Error joining board:", error);
      toast.error("There was an error processing your request. Please try again.", {
        style: { zIndex: 9999 },
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
                  className="w-12 h-12 text-center font-mono font-bold"
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
