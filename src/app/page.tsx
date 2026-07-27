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
import { CheckSquare, Plus, Loader2, Bell, BellRing, BellOff } from 'lucide-react';

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
      <div className="flex min-h-[60vh] flex-1 items-center justify-center p-8">
        <div className="text-muted-foreground flex flex-col items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-border/80 bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg shadow-xs">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-foreground text-lg leading-none font-bold tracking-tight">
                TaskFlow
              </h1>
              <p className="text-muted-foreground mt-0.5 hidden text-xs sm:block">
                Organize & track your daily tasks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Permission Toggle */}
            {notificationPermission === 'granted' ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-emerald-200 bg-emerald-50/50 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                title="OS Push Notifications are Active"
              >
                <Bell className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">Push Active</span>
              </Button>
            ) : notificationPermission === 'denied' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={requestPermission}
                className="gap-1.5 border-rose-200 bg-rose-50/50 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                title="Notifications Blocked - Click to retry"
              >
                <BellOff className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden md:inline">Notifications Blocked</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={requestPermission}
                className="gap-1.5 border-amber-200 bg-amber-50/50 text-xs font-medium text-amber-700 shadow-xs hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
              >
                <BellRing className="h-3.5 w-3.5 animate-bounce text-amber-600 dark:text-amber-400" />
                <span>Enable Push Alerts</span>
              </Button>
            )}

            <Button onClick={handleOpenCreate} className="flex items-center gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
              <h2 id="tasks-heading" className="text-foreground text-xl font-bold">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <footer className="border-border/60 text-muted-foreground bg-background/50 border-t py-6 text-center text-xs">
        <div className="mx-auto max-w-7xl px-4">
          TaskFlow App &bull; Built with Next.js App Router, Web Push Notifications, Tailwind CSS
          &amp; shadcn/ui
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
