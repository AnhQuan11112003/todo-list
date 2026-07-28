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
    <div className="flex flex-col space-y-3 sm:space-y-3.5">
      {/* Top filter row: Search bar & Reset Button */}
      <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search title, notes, projects, tags..."
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

        {/* Priority, Project & Tag Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Dropdown */}
          <Select
            value={filters.priority}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, priority: (val as TaskPriority) || 'all' }))
            }
          >
            <SelectTrigger className="glass-card flex-1 min-w-[130px] rounded-full border-white/60 bg-white/50 text-xs sm:w-[150px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 truncate">
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

          {/* Project Dropdown */}
          <Select
            value={filters.project}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, project: val || 'all' }))}
          >
            <SelectTrigger className="glass-card flex-1 min-w-[130px] rounded-full border-white/60 bg-white/50 text-xs sm:w-[150px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 truncate">
                <FolderKanban className="text-indigo-500 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="All Projects" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 min-w-40 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95">
              <SelectItem value="all" className="rounded-xl text-xs sm:text-sm">
                All Projects
              </SelectItem>
              {allProjects.map((p) => (
                <SelectItem key={p} value={p} className="rounded-xl text-xs sm:text-sm">
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

            <SelectTrigger className="glass-card flex-1 min-w-[130px] rounded-full border-white/60 bg-white/50 text-xs sm:w-[140px] sm:text-sm dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 truncate">
                <TagIcon className="text-purple-500 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="All Tags" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 min-w-40 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95">
              <SelectItem value="all" className="rounded-xl text-xs sm:text-sm">
                All Tags
              </SelectItem>
              {allTags.map((t) => (
                <SelectItem key={t} value={t} className="rounded-xl text-xs sm:text-sm">
                  #{t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {onOpenManageCategories && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenManageCategories}
              className="glass-pill text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 shrink-0 gap-1 px-2.5 text-xs font-semibold sm:gap-1.5 sm:px-3"
              title="Manage Projects & Tags"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Manage</span>
            </Button>
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="glass-pill text-muted-foreground hover:text-foreground shrink-0 gap-1 px-2.5 text-xs sm:gap-1.5 sm:px-3"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="text-xs">Reset</span>
            </Button>
          )}

        </div>
      </div>

      {/* Status Tabs with Horizontal Scroll fallback for small screens */}
      <div className="w-full overflow-x-auto pb-1 no-scrollbar">
        <Tabs
          value={filters.status}
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, status: val as TaskStatus | 'all' }))
          }
          className="w-full"
        >
          <TabsList className="glass-card flex w-full min-w-max grid-cols-4 rounded-xl p-1 sm:grid sm:rounded-full">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="todo"
              className="flex-1 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex-1 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md sm:rounded-full sm:px-3 dark:data-[state=active]:bg-slate-800"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
