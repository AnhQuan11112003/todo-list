'use client';

import { useSyncExternalStore } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
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

  // Badge styles for priorities (iOS VisionOS glass feel)
  const priorityBadgeConfig: Record<TaskPriority, { label: string; className: string }> = {
    low: {
      label: 'Low',
      className:
        'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/20 backdrop-blur-md',
    },
    medium: {
      label: 'Medium',
      className:
        'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 backdrop-blur-md font-medium',
    },
    high: {
      label: 'High',
      className:
        'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 backdrop-blur-md font-bold',
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
        'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/20 backdrop-blur-md',
    },
    'in-progress': {
      label: 'In Progress',
      icon: <Clock className="mr-1 h-3 w-3 text-indigo-500" />,
      className:
        'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 backdrop-blur-md font-medium',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />,
      className:
        'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 backdrop-blur-md font-medium',
    },
  };

  const currentPriority = priorityBadgeConfig[task.priority];
  const currentStatus = statusBadgeConfig[task.status];

  return (
    <div
      className={`glass-card glass-bubble flex h-full flex-col justify-between space-y-4 rounded-3xl p-5 transition-all duration-300 ${
        isCompleted ? 'bg-white/30 opacity-70 dark:bg-slate-900/30' : ''
      }`}
    >
      {/* Header section with Checkbox, Title, and Actions dropdown */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="pt-0.5">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleStatus(task.id)}
              aria-label={`Mark task "${task.title}" as ${isCompleted ? 'todo' : 'completed'}`}
              className="h-5 w-5 rounded-full border-2 border-indigo-500/50 transition-all duration-200 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4
              onClick={() => onToggleStatus(task.id)}
              className={`cursor-pointer truncate text-base leading-snug font-bold tracking-tight transition-colors select-none ${
                isCompleted
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground hover:text-indigo-600 dark:hover:text-indigo-400'
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
                className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 rounded-full hover:bg-white/40 dark:hover:bg-white/10"
                aria-label="Task options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="glass-card w-48 rounded-2xl p-1.5 shadow-2xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Task Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer rounded-xl">
                <Pencil className="text-muted-foreground mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/20 dark:bg-white/10" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                Change Status
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.id, 'todo')}
                className="cursor-pointer rounded-xl"
              >
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.id, 'in-progress')}
                className="cursor-pointer rounded-xl"
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.id, 'completed')}
                className="cursor-pointer rounded-xl"
              >
                Completed
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/20 dark:bg-white/10" />
            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="cursor-pointer rounded-xl text-rose-600 focus:bg-rose-500/15 dark:text-rose-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Due Date & Web Push Reminder Info (if set) */}
      {task.dueDate && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/50 bg-white/40 p-2.5 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <div className="text-foreground flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>

          {isOverdue && (
            <Badge
              variant="destructive"
              className="flex h-5 items-center gap-1 rounded-full px-2 py-0 text-[10px] shadow-sm"
            >
              <AlertTriangle className="h-3 w-3" />
              Overdue
            </Badge>
          )}

          {task.reminderOffset && task.reminderOffset !== 'none' && (
            <div className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Bell className="h-3 w-3" />
              <span>{getReminderLabel(task.reminderOffset)}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer section with Badges and Creation date */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/30 pt-3 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
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

        <div className="text-muted-foreground ml-auto flex items-center gap-1 text-xs font-medium">
          <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
