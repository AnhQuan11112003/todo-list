'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFormData, TaskStatus } from '@/types/task';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { DeleteConfirmDialog } from '@/components/tasks/DeleteConfirmDialog';
import { SnoozeDialog } from '@/components/tasks/SnoozeDialog';
import { ManageCategoriesDialog } from '@/components/tasks/ManageCategoriesDialog';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { EmptyState } from '@/components/tasks/EmptyState';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const {
    tasks,
    filteredTasks,
    stats,
    filters,
    setFilters,
    resetFilters,
    allProjects,
    allTags,
    addProject,
    deleteProject,
    addTag,
    deleteTag,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    snoozeTask,
    cancelSnooze,
    user,
    isAuthLoading,
    signOut,
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

  // Snooze Dialog state
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
  const [taskToSnooze, setTaskToSnooze] = useState<Task | null>(null);

  // Manage Categories Dialog state
  const [isManageOpen, setIsManageOpen] = useState(false);

  // Auth Dialog state
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

  // Open Snooze Dialog
  const handleOpenSnooze = (task: Task) => {
    setTaskToSnooze(task);
    setIsSnoozeOpen(true);
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
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.project !== 'all' ||
    filters.tag !== 'all';

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
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col">
      {/* Decorative Ambient Glass Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>


      {/* Sticky Glassmorphic Header */}
      <Header
        notificationPermission={notificationPermission}
        requestPermission={requestPermission}
        user={user}
        signOut={signOut}
        onOpenAuth={() => setIsAuthOpen(true)}
      />




      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 pt-20 sm:pt-24 py-8 pb-24 sm:pb-8 sm:px-6 lg:px-8">


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
              <div className="flex items-center gap-2">
                <h2 id="tasks-heading" className="text-foreground text-2xl font-bold tracking-tight">
                  My Tasks
                </h2>
                {user && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    ☁️ Supabase Synced
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <TaskFilters
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            allProjects={allProjects}
            allTags={allTags}
            onOpenManageCategories={() => setIsManageOpen(true)}
          />

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
                  onSnooze={snoozeTask}
                  onCancelSnooze={cancelSnooze}
                  onOpenSnoozeDialog={handleOpenSnooze}
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
          TaskFlow &bull; iOS VisionOS Glassmorphism Edition &bull; Next.js &amp; Supabase Cloud Database
        </div>
      </footer>

      {/* Form Dialog for Create & Edit */}
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        taskToEdit={taskToEdit}
        allProjects={allProjects}
        allTags={allTags}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />

      {/* Snooze Dialog */}
      <SnoozeDialog
        open={isSnoozeOpen}
        onOpenChange={setIsSnoozeOpen}
        task={taskToSnooze}
        onSnooze={snoozeTask}
      />

      {/* Manage Projects & Tags Dialog */}
      <ManageCategoriesDialog
        open={isManageOpen}
        onOpenChange={setIsManageOpen}
        allProjects={allProjects}
        allTags={allTags}
        onAddProject={addProject}
        onDeleteProject={deleteProject}
        onAddTag={addTag}
        onDeleteTag={deleteTag}
      />

      {/* Supabase Auth Dialog */}
      <AuthDialog
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
      />

      {/* Floating Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenCreate={handleOpenCreate}
        user={user}
      />

    </div>
  );
}

