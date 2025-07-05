"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, FirstTimeUserFormData } from "@/types/user";

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isFirstTimeUser: boolean;
  isLoading: boolean;
  error: string | null;
  createProfile: (data: FirstTimeUserFormData) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchUserProfile = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (!data) {
        // No profile exists, this is a first-time user
        setIsFirstTimeUser(true);
        setUserProfile(null);
      } else {
        setUserProfile(data);
        setIsFirstTimeUser(false);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  };

  const refreshProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('No authenticated user');
      }

      await fetchUserProfile(user);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh profile');
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (data: FirstTimeUserFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('No authenticated user');
      }

      const profileData = {
        id: user.id,
        email: user.email!,
        first_name: data.firstName,
        last_name: data.lastName,
        university: data.university,
        course_subject: data.courseSubject,
      };

      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setUserProfile(newProfile);
      setIsFirstTimeUser(false);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      await refreshProfile();
    };

    initializeProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshProfile();
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          setIsFirstTimeUser(false);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    userProfile,
    isFirstTimeUser,
    isLoading,
    error,
    createProfile,
    refreshProfile,
  };
}
