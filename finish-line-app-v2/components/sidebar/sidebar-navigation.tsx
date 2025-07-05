"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, FolderKanban } from "lucide-react";
import { getBoardByBoardCode } from "@/lib/supabase/boards";
import { Board } from "@/types/boards";
import { Icon } from "@/components/ui/icon-picker";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function SidebarNavigation({ items, className }: SidebarNavigationProps) {
  const pathname = usePathname();
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);

  // Extract board code from pathname if on a board page
  const currentBoardCode = pathname.startsWith('/boards/') && pathname !== '/boards' 
    ? pathname.split('/boards/')[1] 
    : null;

  useEffect(() => {
    const fetchCurrentBoard = async () => {
      if (currentBoardCode) {
        setIsLoadingBoard(true);
        try {
          const board = await getBoardByBoardCode(currentBoardCode);
          setCurrentBoard(board);
        } catch (error) {
          console.error("Error fetching board:", error);
          setCurrentBoard(null);
        } finally {
          setIsLoadingBoard(false);
        }
      } else {
        setCurrentBoard(null);
      }
    };

    fetchCurrentBoard();
  }, [currentBoardCode]);

  return (
    <nav className={cn("flex-1 space-y-1 p-4", className)}>
      {items.map((item) => {
        // Handle boards navigation specially
        if (item.name === "Boards") {
          const isBoardsPage = pathname === '/boards';
          const isOnSpecificBoard = pathname.startsWith('/boards/') && pathname !== '/boards';
          const isActive = isBoardsPage || isOnSpecificBoard;

          return (
            <div key={item.name} className="space-y-1">
              {/* Main Boards link */}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isBoardsPage
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>

              {/* Submenu for specific board */}
              {isOnSpecificBoard && (
                <div className="ml-4 space-y-1">
                  <Link
                    href={`/boards/${currentBoardCode}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      "bg-primary text-primary-foreground"
                    )}
                  >
                    {currentBoard?.icon ? (
                      <Icon name={currentBoard.icon as any} className="h-4 w-4" />
                    ) : (
                      <FolderKanban className="h-4 w-4" />
                    )}
                    <span className="truncate">
                      {isLoadingBoard 
                        ? "Loading..." 
                        : currentBoard?.title || "Board"}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          );
        }

        // Regular navigation items
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
