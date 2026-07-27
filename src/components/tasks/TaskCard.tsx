'use client';

import { useSyncExternalStore } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  CircleAlert,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { getReminderLabel } from '@/lib/notifications';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Stable current time store for useSyncExternalStore
let currentNow: number | null = typeof window !== 'undefined' ? Date.now() : null;
const timeListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  setInterval(() => {
    currentNow = Date.now();
    timeListeners.forEach((listener) => listener());
  }, 10000);
}

function subscribeTime(onStoreChange: () => void) {
  timeListeners.add(onStoreChange);
  return () => {
    timeListeners.delete(onStoreChange);
  };
}

function getClientNow() {
  if (currentNow === null && typeof window !== 'undefined') {
    currentNow = Date.now();
  }
  return currentNow;
}

function getServerNow() {
  return null;
}

export function TaskCard({
  task,
  onToggleStatus,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const now = useSyncExternalStore(subscribeTime, getClientNow, getServerNow);
  const isCompleted = task.status === 'completed';

  const isOverdue =
    now !== null && !isCompleted && task.dueDate ? new Date(task.dueDate).getTime() < now : false;

  // Format date cleanly
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Badge styles for priorities
  const priorityBadgeConfig: Record<TaskPriority, { label: string; className: string }> = {
    low: {
      label: 'Low',
      className:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    },
    medium: {
      label: 'Medium',
      className:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
    },
    high: {
      label: 'High',
      className:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/50 font-semibold',
    },
  };

  // Badge styles for status
  const statusBadgeConfig: Record<
    TaskStatus,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    todo: {
      label: 'To Do',
      icon: <CircleAlert className="mr-1 h-3 w-3 text-slate-500" />,
      className:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    },
    'in-progress': {
      label: 'In Progress',
      icon: <Clock className="mr-1 h-3 w-3 text-amber-500" />,
      className:
        'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />,
      className:
        'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
  };

  const currentPriority = priorityBadgeConfig[task.priority];
  const currentStatus = statusBadgeConfig[task.status];

  return (
    <Card
      className={`group border-border/60 transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'bg-muted/30 opacity-80' : 'bg-card'
      }`}
    >
      <CardContent className="flex h-full flex-col justify-between space-y-4 p-4 sm:p-5">
        {/* Header section with Checkbox, Title, and Actions dropdown */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="pt-0.5">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => onToggleStatus(task.id)}
                aria-label={`Mark task "${task.title}" as ${isCompleted ? 'todo' : 'completed'}`}
                className="h-5 w-5 rounded-md"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4
                onClick={() => onToggleStatus(task.id)}
                className={`cursor-pointer truncate text-base leading-snug font-semibold select-none ${
                  isCompleted
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground hover:text-primary transition-colors'
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
                  aria-label="Task options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="text-muted-foreground mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                  Change Status
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-rose-600 focus:bg-rose-50 dark:text-rose-400 dark:focus:bg-rose-950/50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Due Date & Web Push Reminder Info (if set) */}
        {task.dueDate && (
          <div className="bg-muted/40 border-border/40 flex flex-wrap items-center justify-between gap-2 rounded-md border p-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="text-primary h-3.5 w-3.5" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>

            {isOverdue && (
              <Badge
                variant="destructive"
                className="flex h-5 items-center gap-1 px-1.5 py-0 text-[10px]"
              >
                <AlertTriangle className="h-3 w-3" />
                Overdue
              </Badge>
            )}

            {task.reminderOffset && task.reminderOffset !== 'none' && (
              <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                <Bell className="h-3 w-3" />
                <span>{getReminderLabel(task.reminderOffset)}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer section with Badges and Creation date */}
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-t pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={`rounded-full px-2.5 py-0.5 text-xs ${currentStatus.className}`}
            >
              {currentStatus.icon}
              {currentStatus.label}
            </Badge>
            <Badge
              variant="outline"
              className={`rounded-full px-2 py-0.5 text-xs ${currentPriority.className}`}
            >
              {currentPriority.label}
            </Badge>
          </div>

          <div className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
