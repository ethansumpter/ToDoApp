import { createClient } from './client';
import { CreateBoardFormData } from '@/types/create-board';
import { Board } from '@/types/boards';

function generateBoardCode(): string {
    let char_opt = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * char_opt.length);
        code += char_opt[randomIndex];
    }
    return code;
}

export async function createBoard(formData: CreateBoardFormData): Promise<Board> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Prepare board data for database
  const boardData: Omit<Board, 'id' | 'created_at' | 'updated_at'> = {
    title: formData.title,
    description: formData.description,
    deadline: formData.deadline,
    icon: formData.icon,
    categories: formData.taskCategories,
    statuses: formData.taskStatuses,
    admin: user.id,
    archived: false,
    allowed_users: [user.id],
    pending_users: [],
    b_code: generateBoardCode(),
  };

  // Insert the board into the database
  const { data, error } = await supabase
    .from('boards')
    .insert([boardData])
    .select()
    .single();

  if (error) {
    console.error('Error creating board:', error);
    throw new Error(error.message || 'Failed to create board');
  }

  return data;
}

export async function getUserBoards(userId?: string): Promise<Board[]> {
  const supabase = createClient();
  
  let targetUserId = userId;
  
  // If no userId provided, get current user
  if (!targetUserId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    targetUserId = user.id;
  }

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching boards:', error);
    throw new Error(error.message || 'Failed to fetch boards');
  }

  return data || [];
}

export async function getBoardById(boardId: number): Promise<Board | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single();

  if (error) {
    console.error('Error fetching board:', error);
    throw new Error(error.message || 'Failed to fetch board');
  }

  return data;
}

export async function updateBoard(boardId: number, updates: Partial<Board>): Promise<Board> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    console.error('Error updating board:', error);
    throw new Error(error.message || 'Failed to update board');
  }

  return data;
}

export async function deleteBoard(boardId: number): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId);

  if (error) {
    console.error('Error deleting board:', error);
    throw new Error(error.message || 'Failed to delete board');
  }
}
