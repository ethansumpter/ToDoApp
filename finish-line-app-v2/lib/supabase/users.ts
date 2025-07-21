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
  
  console.log('getUserProfiles called with:', userIds);
  
  if (userIds.length === 0) {
    console.log('No user IDs provided, returning empty array');
    return [];
  }

  console.log('Querying users table for IDs:', userIds);
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (error) {
    console.error('Error fetching user profiles:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw new Error(error.message || 'Failed to fetch user profiles');
  }

  console.log('Database query successful, returned data:', data);
  console.log('Number of users found:', data?.length || 0);
  
  return data || [];
}

export function formatUserDisplayName(user: UserProfile): string {
  return `${user.first_name} ${user.last_name.charAt(0)}.`;
}
