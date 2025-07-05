import { createClient } from './client';
import { TaskFormData } from '@/types/tasks';

export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  status: string;
  created_by: string; // User ID (UUID)
  assignee?: string; // User ID (UUID) - fixed typo
  deadline?: string; // Date string in YYYY-MM-DD format
  board: number; // Board ID
  priority?: 'low' | 'medium' | 'high';
}

export async function createTask(taskData: CreateTaskData) {
  const supabase = createClient();
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('User not authenticated:', authError);
    throw new Error('User not authenticated');
  }
  
  console.log('Authenticated user:', user.id);
  console.log('Creating task with data:', taskData);

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      status: taskData.status,
      created_by: taskData.created_by,
      assignee: taskData.assignee, // Fixed typo
      deadline: taskData.deadline,
      board: taskData.board,
      priority: taskData.priority,
    }])
    .select()
    .single();

  console.log('Supabase response:', { data, error });

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message || 'Failed to create task');
  }

  return data;
}

export async function getTasksByBoard(boardId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('board', boardId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message || 'Failed to fetch tasks');
  }

  return data || [];
}
