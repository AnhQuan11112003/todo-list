'use client';

import { TaskStatsData } from '@/types/task';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStatsData;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* Total Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-3xl p-5">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Total Tasks
          </p>
          <h3 className="text-foreground mt-1 text-3xl font-extrabold tracking-tight">
            {stats.total}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 shadow-inner dark:text-indigo-400">
          <ListTodo className="h-6 w-6" />
        </div>
      </div>

      {/* Active Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-3xl p-5">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Active
          </p>
          <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
            {stats.active}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-inner dark:text-amber-400">
          <Clock className="h-6 w-6" />
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-3xl p-5">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Completed
          </p>
          <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-inner dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
      </div>

      {/* High Priority Tasks */}
      <div className="glass-card glass-bubble flex items-center justify-between rounded-3xl p-5">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            High Priority
          </p>
          <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
            {stats.highPriority}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 shadow-inner dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
