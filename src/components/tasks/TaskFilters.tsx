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
    <div className="flex flex-col space-y-3.5 sm:space-y-4">
      {/* Top filter row: Search bar & Priority dropdown */}
      <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="glass-card rounded-full border-white/60 bg-white/50 pr-9 pl-9 text-xs focus:bg-white/80 sm:text-sm dark:border-white/10 dark:bg-slate-900/50"
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
            <SelectTrigger className="glass-card w-full rounded-full border-white/60 bg-white/50 text-xs sm:w-[170px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 truncate">
                <Filter className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="All Priorities" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 min-w-40 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95">
              <SelectItem value="all" className="rounded-xl text-xs sm:text-sm">
                All Priorities
              </SelectItem>
              <SelectItem value="low" className="rounded-xl text-xs sm:text-sm">
                Low Priority
              </SelectItem>
              <SelectItem value="medium" className="rounded-xl text-xs sm:text-sm">
                Medium Priority
              </SelectItem>
              <SelectItem value="high" className="rounded-xl text-xs sm:text-sm">
                High Priority
              </SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="glass-pill text-muted-foreground hover:text-foreground shrink-0 gap-1.5 px-3 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="w-full overflow-x-auto pb-0.5">
        <Tabs
          value={filters.status}
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, status: val as TaskStatus | 'all' }))
          }
          className="w-full"
        >
          <TabsList className="glass-card grid w-full grid-cols-4 rounded-xl p-1 sm:rounded-full">
            <TabsTrigger
              value="all"
              className="truncate rounded-lg px-1.5 py-1.5 text-[11px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 sm:text-xs dark:data-[state=active]:bg-slate-800"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="todo"
              className="truncate rounded-lg px-1.5 py-1.5 text-[11px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 sm:text-xs dark:data-[state=active]:bg-slate-800"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="truncate rounded-lg px-1.5 py-1.5 text-[11px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 sm:text-xs dark:data-[state=active]:bg-slate-800"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="truncate rounded-lg px-1.5 py-1.5 text-[11px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 sm:text-xs dark:data-[state=active]:bg-slate-800"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
