import { createClient } from './client';
import { UserProfile } from '@/types/user';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function getUserProfiles(userIds: string[]): Promise<UserProfile[]> {
  const supabase = createClient();
  
  if (userIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (error) {
    console.error('Error fetching user profiles:', error);
    throw new Error(error.message || 'Failed to fetch user profiles');
  }

  return data || [];
}

export function formatUserDisplayName(user: UserProfile): string {
  return `${user.first_name} ${user.last_name.charAt(0)}.`;
}
