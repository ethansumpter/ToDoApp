"use client";

import { Sidebar } from "@/components/sidebar";
import { CreateBoardProvider } from "@/components/create-board/create-board-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you'd check authentication here
  // For demo purposes, we'll assume user is authenticated

  const handleBoardCreated = (data: any) => {
    console.log("New board created:", data);
    // In a real app, you would refresh the boards list or navigate
  };
  
  return (
    <CreateBoardProvider onBoardCreated={handleBoardCreated}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </CreateBoardProvider>
  );
}