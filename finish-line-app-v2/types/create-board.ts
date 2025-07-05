export interface CreateBoardFormData {
  title: string;
  description: string;
  deadline: string;
  icon: string; // Now stores icon name instead of emoji
  taskCategories: string[];
  taskStatuses: string[];
}

export interface TaskCategory {
  id: string;
  name: string;
  color?: string;
}

export interface TaskStatus {
  id: string;
  name: string;
  color?: string;
}
