'use client';

import { TaskFiltersState, TaskPriority, TaskStatus } from '@/types/task';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, X, RotateCcw, Filter } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFiltersState>>;
  resetFilters: () => void;
}

export function TaskFilters({ filters, setFilters, resetFilters }: TaskFiltersProps) {
  const isFiltered =
    filters.search !== '' || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="flex flex-col space-y-4">
      {/* Top filter row: Search bar & Priority dropdown */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="glass-card rounded-full border-white/60 bg-white/50 pr-10 pl-10 focus:bg-white/80 dark:border-white/10 dark:bg-slate-900/50"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.priority}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, priority: val as TaskPriority | 'all' }))
            }
          >
            <SelectTrigger className="glass-card w-full rounded-full border-white/60 bg-white/50 sm:w-[170px] dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-3.5 w-3.5" />
                <SelectValue placeholder="All Priorities" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-card rounded-2xl p-1 shadow-2xl">
              <SelectItem value="all" className="rounded-xl">
                All Priorities
              </SelectItem>
              <SelectItem value="low" className="rounded-xl">
                Low Priority
              </SelectItem>
              <SelectItem value="medium" className="rounded-xl">
                Medium Priority
              </SelectItem>
              <SelectItem value="high" className="rounded-xl">
                High Priority
              </SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="glass-pill text-muted-foreground hover:text-foreground gap-1.5 px-3"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center justify-between overflow-x-auto pb-1">
        <Tabs
          value={filters.status}
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, status: val as TaskStatus | 'all' }))
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="glass-card grid w-full min-w-[340px] grid-cols-4 rounded-full p-1 sm:w-auto">
            <TabsTrigger
              value="all"
              className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="todo"
              className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
