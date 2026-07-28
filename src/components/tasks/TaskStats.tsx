'use client';

import { TaskStatsData } from '@/types/task';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStatsData;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
      {/* Total Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-2xl p-3.5 sm:rounded-3xl sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-[10px] font-bold tracking-wider uppercase sm:text-xs">
            Total Tasks
          </p>
          <h3 className="text-foreground mt-0.5 text-2xl font-extrabold tracking-tight sm:mt-1 sm:text-3xl">
            {stats.total}
          </h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 shadow-inner sm:h-12 sm:w-12 sm:rounded-2xl dark:text-indigo-400">
          <ListTodo className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* Active Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-2xl p-3.5 sm:rounded-3xl sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-[10px] font-bold tracking-wider uppercase sm:text-xs">
            Active
          </p>
          <h3 className="mt-0.5 text-2xl font-extrabold tracking-tight text-amber-600 sm:mt-1 sm:text-3xl dark:text-amber-400">
            {stats.active}
          </h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 shadow-inner sm:h-12 sm:w-12 sm:rounded-2xl dark:text-amber-400">
          <Clock className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-2xl p-3.5 sm:rounded-3xl sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-[10px] font-bold tracking-wider uppercase sm:text-xs">
            Completed
          </p>
          <h3 className="mt-0.5 text-2xl font-extrabold tracking-tight text-emerald-600 sm:mt-1 sm:text-3xl dark:text-emerald-400">
            {stats.completed}
          </h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 shadow-inner sm:h-12 sm:w-12 sm:rounded-2xl dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* High Priority Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-2xl p-3.5 sm:rounded-3xl sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-[10px] font-bold tracking-wider uppercase sm:text-xs">
            High Priority
          </p>
          <h3 className="mt-0.5 text-2xl font-extrabold tracking-tight text-rose-600 sm:mt-1 sm:text-3xl dark:text-rose-400">
            {stats.highPriority}
          </h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 shadow-inner sm:h-12 sm:w-12 sm:rounded-2xl dark:text-rose-400">
          <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}
