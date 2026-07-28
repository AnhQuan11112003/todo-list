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
import { Search, X, RotateCcw, Filter, FolderKanban, Tag as TagIcon } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFiltersState>>;
  resetFilters: () => void;
  allProjects?: string[];
  allTags?: string[];
  onOpenManageCategories?: () => void;
}

export function TaskFilters({
  filters,
  setFilters,
  resetFilters,
  allProjects = [],
  allTags = [],
  onOpenManageCategories,
}: TaskFiltersProps) {

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.project !== 'all' ||
    filters.tag !== 'all';

  return (
    <div className="flex flex-col space-y-3 sm:space-y-3.5 w-full max-w-full overflow-hidden">
      {/* Top filter row: Search bar & Reset Button */}
      <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3 w-full">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search title, notes, projects, tags..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="glass-card rounded-full border-white/60 bg-white/50 pr-9 pl-9 text-xs focus:bg-white/80 sm:text-sm dark:border-white/10 dark:bg-slate-900/50 w-full"
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

        {/* Priority, Project & Tag Dropdowns */}
        <div className="grid grid-cols-3 gap-1.5 w-full sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2">
          {/* Priority Dropdown */}
          <Select
            value={filters.priority}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, priority: (val as TaskPriority) || 'all' }))
            }
          >
            <SelectTrigger className="glass-card w-full rounded-full border-white/60 bg-white/50 px-2 text-xs sm:w-[130px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-1 truncate min-w-0">
                <Filter className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Priority" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 min-w-36 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95">
              <SelectItem value="all" className="rounded-xl text-xs">
                All Priorities
              </SelectItem>
              <SelectItem value="low" className="rounded-xl text-xs">
                Low Priority
              </SelectItem>
              <SelectItem value="medium" className="rounded-xl text-xs">
                Medium Priority
              </SelectItem>
              <SelectItem value="high" className="rounded-xl text-xs">
                High Priority
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Project Dropdown */}
          <Select
            value={filters.project}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, project: val || 'all' }))}
          >
            <SelectTrigger className="glass-card w-full rounded-full border-white/60 bg-white/50 px-2 text-xs sm:w-[130px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-1 truncate min-w-0">
                <FolderKanban className="text-indigo-500 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Project" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 min-w-36 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95">
              <SelectItem value="all" className="rounded-xl text-xs">
                All Projects
              </SelectItem>
              {allProjects.map((p) => (
                <SelectItem key={p} value={p} className="rounded-xl text-xs">
                  📁 {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tag Dropdown */}
          <Select
            value={filters.tag}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, tag: val || 'all' }))}
          >
            <SelectTrigger className="glass-card w-full rounded-full border-white/60 bg-white/50 px-2 text-xs sm:w-[130px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-1 truncate min-w-0">
                <TagIcon className="text-purple-500 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Tag" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 min-w-36 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95">
              <SelectItem value="all" className="rounded-xl text-xs">
                All Tags
              </SelectItem>
              {allTags.map((t) => (
                <SelectItem key={t} value={t} className="rounded-xl text-xs">
                  #{t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Secondary controls row */}
        {(onOpenManageCategories || isFiltered) && (
          <div className="flex items-center gap-2 justify-end">
            {onOpenManageCategories && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenManageCategories}
                className="glass-pill text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 shrink-0 gap-1 px-2.5 text-xs font-semibold"
                title="Manage Projects & Tags"
              >
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Categories</span>
              </Button>
            )}

            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="glass-pill text-muted-foreground hover:text-foreground shrink-0 gap-1 px-2.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Responsive Status Tabs Grid */}
      <div className="w-full">
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
              className="rounded-lg px-1 py-1.5 text-center text-[11px] font-semibold truncate sm:text-xs data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="todo"
              className="rounded-lg px-1 py-1.5 text-center text-[11px] font-semibold truncate sm:text-xs data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="rounded-lg px-1 py-1.5 text-center text-[11px] font-semibold truncate sm:text-xs data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-lg px-1 py-1.5 text-center text-[11px] font-semibold truncate sm:text-xs data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              Done
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
