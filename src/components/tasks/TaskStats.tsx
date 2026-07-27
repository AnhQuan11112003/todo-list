'use client';

import { TaskStatsData } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStatsData;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* Total Tasks */}
      <Card className="border-border/60 hover:border-primary/40 shadow-xs transition-colors">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Tasks
            </p>
            <h3 className="text-foreground mt-1 text-2xl font-bold">{stats.total}</h3>
          </div>
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <ListTodo className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Active Tasks */}
      <Card className="border-border/60 shadow-xs transition-colors hover:border-amber-500/40">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Active
            </p>
            <h3 className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.active}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card className="border-border/60 shadow-xs transition-colors hover:border-emerald-500/40">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Completed
            </p>
            <h3 className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* High Priority Tasks */}
      <Card className="border-border/60 shadow-xs transition-colors hover:border-rose-500/40">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              High Priority
            </p>
            <h3 className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {stats.highPriority}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
