export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ReminderOffset = 'none' | '10m' | '30m' | '1h' | '1d';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reminderOffset?: ReminderOffset;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reminderOffset?: ReminderOffset;
};

export interface TaskFiltersState {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}

export interface TaskStatsData {
  total: number;
  active: number;
  completed: number;
  todo: number;
  inProgress: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
}
