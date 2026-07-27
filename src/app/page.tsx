'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFormData, TaskStatus } from '@/types/task';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { DeleteConfirmDialog } from '@/components/tasks/DeleteConfirmDialog';
import { EmptyState } from '@/components/tasks/EmptyState';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, Loader2, Bell, BellRing, BellOff, Sparkles } from 'lucide-react';

export default function Home() {
  const {
    tasks,
    filteredTasks,
    stats,
    filters,
    setFilters,
    resetFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    isHydrated,
    notificationPermission,
    requestPermission,
  } = useTasks();

  // Form Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Open dialog for creation
  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  // Open dialog for editing
  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  // Open confirmation for deletion
  const handleOpenDelete = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  // Handle Form Submission (Create or Edit)
  const handleFormSubmit = (data: TaskFormData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data);
    } else {
      addTask(data);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
    setIsDeleteOpen(false);
  };

  // Handle status update from dropdown
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  const hasActiveFilters =
    filters.search !== '' || filters.status !== 'all' || filters.priority !== 'all';

  if (!isHydrated) {
    return (
      <div className="bg-aurora flex min-h-screen flex-1 items-center justify-center p-8">
        <div className="glass-card flex flex-col items-center gap-3 rounded-3xl p-8 shadow-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-muted-foreground text-sm font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col overflow-hidden">
      {/* Decorative Ambient Glass Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

      {/* Glassmorphic Floating Header */}
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-foreground text-lg font-extrabold tracking-tight">TaskFlow</h1>
                <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
              </div>
              <p className="text-muted-foreground hidden text-xs sm:block">
                iOS Bubble Glass Task Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Permission Toggle */}
            {notificationPermission === 'granted' ? (
              <Button
                variant="ghost"
                size="sm"
                className="glass-pill gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                title="OS Push Notifications are Active"
              >
                <Bell className="h-3.5 w-3.5 text-emerald-500" />
                <span className="hidden md:inline">Push Active</span>
              </Button>
            ) : notificationPermission === 'denied' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={requestPermission}
                className="glass-pill gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                title="Notifications Blocked - Click to retry"
              >
                <BellOff className="h-3.5 w-3.5 text-rose-500" />
                <span className="hidden md:inline">Notifications Blocked</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={requestPermission}
                className="glass-pill gap-1.5 border-amber-300/60 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
              >
                <BellRing className="h-3.5 w-3.5 animate-bounce text-amber-500" />
                <span>Enable Push Alerts</span>
              </Button>
            )}

            <Button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40 active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>New Task</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Task Statistics
          </h2>
          <TaskStats stats={stats} />
        </section>

        {/* Task Control & Listing Area */}
        <section className="space-y-6" aria-labelledby="tasks-heading">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 id="tasks-heading" className="text-foreground text-2xl font-bold tracking-tight">
                My Tasks
              </h2>
              <p className="text-muted-foreground text-sm">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <TaskFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

          {/* Task List / Grid */}
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onStatusChange={handleStatusChange}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              hasFilters={hasActiveFilters}
              onCreateTask={handleOpenCreate}
              onResetFilters={resetFilters}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground relative z-10 border-t border-white/20 bg-white/20 py-6 text-center text-xs backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4">
          TaskFlow &bull; iOS VisionOS Glassmorphism Edition &bull; Next.js &amp; Tailwind CSS
        </div>
      </footer>

      {/* Form Dialog for Create & Edit */}
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}
