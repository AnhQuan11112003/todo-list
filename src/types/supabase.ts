import { ReminderOffset, Task, TaskPriority, TaskStatus } from './task';

export interface SupabaseTaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  reminder_offset: string | null;
  reminder_sent: boolean | null;
  snoozed_until: string | null;
  project: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export function mapRowToTask(row: SupabaseTaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    status: (row.status as TaskStatus) || 'todo',
    priority: (row.priority as TaskPriority) || 'medium',
    dueDate: row.due_date || undefined,
    reminderOffset: (row.reminder_offset as ReminderOffset) || 'none',
    reminderSent: row.reminder_sent ?? false,
    snoozedUntil: row.snoozed_until || undefined,
    project: row.project || undefined,
    tags: row.tags || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapTaskToInsertRow(task: Partial<Task>, userId: string) {
  return {
    user_id: userId,
    title: task.title || 'Untitled Task',
    description: task.description || '',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    due_date: task.dueDate || null,
    reminder_offset: task.reminderOffset || 'none',
    reminder_sent: task.reminderSent ?? false,
    snoozed_until: task.snoozedUntil || null,
    project: task.project || null,
    tags: task.tags || [],
    created_at: task.createdAt || new Date().toISOString(),
    updated_at: task.updatedAt || new Date().toISOString(),
  };
}

export function mapTaskToUpdateRow(task: Partial<Task>) {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (task.title !== undefined) payload.title = task.title;
  if (task.description !== undefined) payload.description = task.description;
  if (task.status !== undefined) payload.status = task.status;
  if (task.priority !== undefined) payload.priority = task.priority;
  if (task.dueDate !== undefined) payload.due_date = task.dueDate || null;
  if (task.reminderOffset !== undefined) payload.reminder_offset = task.reminderOffset || 'none';
  if (task.reminderSent !== undefined) payload.reminder_sent = task.reminderSent;
  if (task.snoozedUntil !== undefined) payload.snoozed_until = task.snoozedUntil || null;
  if (task.project !== undefined) payload.project = task.project || null;
  if (task.tags !== undefined) payload.tags = task.tags || [];

  return payload;
}
