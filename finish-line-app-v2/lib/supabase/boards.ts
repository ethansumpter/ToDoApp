import { createClient } from './client';
import { CreateBoardFormData } from '@/types/create-board';
import { Board } from '@/types/boards';

async function generateUniqueBoardCode(): Promise<string> {
    const supabase = createClient();
    let code = '';
    let isUnique = false;
    
    // Try up to 10 times to generate a unique code
    for (let attempts = 0; attempts < 10; attempts++) {
        let char_opt = 'abcdefghijklmnopqrstuvwxyz0123456789';
        code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * char_opt.length);
            code += char_opt[randomIndex];
        }
        
        // Check if this code already exists
        const { data, error } = await supabase
            .from('boards')
            .select('b_code')
            .eq('b_code', code)
            .single();
        
        if (error && error.code === 'PGRST116') {
            // No rows found, code is unique
            isUnique = true;
            break;
        } else if (error) {
            console.error('Error checking board code uniqueness:', error);
            // Continue trying with a new code
        }
    }
    
    if (!isUnique) {
        throw new Error('Unable to generate unique board code after 10 attempts');
    }
    
    return code;
}

export async function createBoard(formData: CreateBoardFormData): Promise<Board> {
  const supabase = createClient();
  console.log('Starting board creation process...');
  
  // Get the current user
  console.log('Getting current user...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication error:', authError);
    throw new Error('User not authenticated');
  }
  console.log('User authenticated successfully');

  // Generate unique board code
  console.log('Generating unique board code...');
  const boardCode = await generateUniqueBoardCode();
  console.log('Generated board code:', boardCode);

  // Prepare board data for database
  const boardData = {
    title: formData.title,
    description: formData.description,
    deadline: formData.deadline,
    icon: formData.icon,
    categories: formData.taskCategories,
    statuses: formData.taskStatuses,
    admin: user.id, // This should be the user ID from auth
    archived: false,
    allowed_users: [user.id],
    pending_users: [],
    b_code: boardCode,
  };

  // Insert the board into the database
  console.log('Inserting board into database...');
  const { data, error } = await supabase
    .from('boards')
    .insert([boardData])
    .select()
    .single();

  if (error) {
    console.error('Error creating board:', error);
    throw new Error(error.message || 'Failed to create board');
  }

  console.log('Board created successfully:', data);
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
    .eq('admin', targetUserId)
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

export async function getBoardByBoardCode(shareCode: string): Promise<Board | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('b_code', shareCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    console.error('Error fetching board by board code:', error);
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
