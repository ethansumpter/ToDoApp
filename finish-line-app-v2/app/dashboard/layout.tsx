"use client";

import { Sidebar } from "@/components/sidebar";
import { CreateBoardProvider } from "@/components/create-board/create-board-provider";
import { FirstTimeUserModal } from "@/components/auth/first-time-user-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { FirstTimeUserFormData } from "@/types/user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const router = useRouter();
  
  const { 
    userProfile, 
    isFirstTimeUser, 
    isLoading: profileLoading, 
    error: profileError,
    createProfile 
  } = useUserProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push("../");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("../");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push("../");
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleBoardCreated = (data: any) => {
    console.log("New board created:", data);
    // In a real app, you would refresh the boards list or navigate
  };

  const handleFirstTimeUserSubmit = async (data: FirstTimeUserFormData) => {
    setIsCreatingProfile(true);
    try {
      await createProfile(data);
      // Profile created successfully, modal will close automatically
    } catch (error) {
      console.error('Failed to create profile:', error);
      // Error handling is managed by the hook
    } finally {
      setIsCreatingProfile(false);
    }
  };

  // Show loading if either auth or profile is loading
  if (isLoading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This will be brief as redirect happens in useEffect
  }
  
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
      
      {/* First-time user modal */}
      <FirstTimeUserModal
        open={isFirstTimeUser && isAuthenticated}
        onSubmit={handleFirstTimeUserSubmit}
        isLoading={isCreatingProfile}
      />
    </CreateBoardProvider>
  );
}