export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
  assignee?: string;
}

export interface AddTaskProps {
  status: string;
  onSave: (taskData: TaskFormData) => void;
  onCancel: () => void;
  categories: string[];
  availableUsers: string[];
}
