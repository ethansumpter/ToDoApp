export interface ProjectBoard {
  id: number;
  name: string;
  description?: string;
  incompleteTasksCount: number;
  totalTasks: number;
  role: string;
  progress: number;
  dueDate: string;
  members: number;
  subject: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Database board structure (matches Supabase table)
export interface Board {
  id: number;
  created_at: string;
  b_code: string;
  title: string;
  description?: string;
  admin: string;
  archived: boolean;
  allowed_users: string[];
  pending_users: string[];
  deadline?: string;
  statuses: string[];
  categories: string[];
  icon: string;
  updated_at: string;
}

export interface BoardAction {
  onEdit: (boardId: number) => void;
  onArchive: (boardId: number) => void;
  onManageTeam: (boardId: number) => void;
}
