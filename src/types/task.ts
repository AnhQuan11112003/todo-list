export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ReminderOffset = 'none' | '10m' | '30m' | '1h' | '1d';
export type SnoozeDuration =
  | '10m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | 'tonight'
  | 'tomorrow-morning'
  | 'tomorrow-afternoon'
  | 'next-week';


export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reminderOffset?: ReminderOffset;
  reminderSent?: boolean;
  snoozedUntil?: string;
  project?: string;
  tags?: string[];
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
  project?: string;
  tags?: string[];
};

export interface TaskFiltersState {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  project: string | 'all';
  tag: string | 'all';
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


