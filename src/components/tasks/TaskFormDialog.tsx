'use client';

import { useState } from 'react';
import { ReminderOffset, Task, TaskFormData, TaskPriority, TaskStatus } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Bell, Calendar } from 'lucide-react';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  taskToEdit?: Task | null;
}

interface InnerFormProps {
  taskToEdit?: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

function TaskFormInner({ taskToEdit, onSubmit, onCancel }: InnerFormProps) {
  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState(taskToEdit?.title ?? '');
  const [description, setDescription] = useState(taskToEdit?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status ?? 'todo');
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState<string>(
    taskToEdit?.dueDate ? taskToEdit.dueDate.slice(0, 16) : ''
  );
  const [reminderOffset, setReminderOffset] = useState<ReminderOffset>(
    taskToEdit?.reminderOffset ?? 'none'
  );
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate ? dueDate : undefined,
      reminderOffset,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-base font-bold sm:text-lg">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          {isEditing
            ? 'Update your task details, deadline, and notification reminders.'
            : 'Add a new task to your list. Set due dates and reminders.'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid max-h-[65vh] gap-3 overflow-y-auto py-3 pr-1 sm:gap-4 sm:py-4">
        {/* Title input */}
        <div className="grid gap-1.5 sm:gap-2">
          <label htmlFor="task-title" className="text-foreground text-xs font-medium sm:text-sm">
            Title <span className="text-rose-500">*</span>
          </label>
          <Input
            id="task-title"
            placeholder="e.g. Redesign user profile page"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError(null);
            }}
            className={`text-xs sm:text-sm ${titleError ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
            autoFocus
          />
          {titleError && (
            <div className="flex items-center gap-1 text-xs font-medium text-rose-500">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{titleError}</span>
            </div>
          )}
        </div>

        {/* Description textarea */}
        <div className="grid gap-1.5 sm:gap-2">
          <label
            htmlFor="task-description"
            className="text-foreground text-xs font-medium sm:text-sm"
          >
            Description
          </label>
          <Textarea
            id="task-description"
            placeholder="Add additional notes or details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="text-xs sm:text-sm"
          />
        </div>

        {/* Status & Priority selects */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-1.5 sm:gap-2">
            <label htmlFor="task-status" className="text-foreground text-xs font-medium sm:text-sm">
              Status
            </label>
            <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
              <SelectTrigger id="task-status" className="text-xs sm:text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5 sm:gap-2">
            <label
              htmlFor="task-priority"
              className="text-foreground text-xs font-medium sm:text-sm"
            >
              Priority
            </label>
            <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
              <SelectTrigger id="task-priority" className="text-xs sm:text-sm">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date & Reminder selects */}
        <div className="border-border/60 grid grid-cols-1 gap-3 border-t pt-2 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-1.5 sm:gap-2">
            <label
              htmlFor="task-duedate"
              className="text-foreground flex items-center gap-1.5 text-xs font-medium sm:text-sm"
            >
              <Calendar className="text-primary h-3.5 w-3.5 shrink-0" />
              Due Date &amp; Time
            </label>
            <Input
              id="task-duedate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="grid gap-1.5 sm:gap-2">
            <label
              htmlFor="task-reminder"
              className="text-foreground flex items-center gap-1.5 text-xs font-medium sm:text-sm"
            >
              <Bell className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              Web Push Reminder
            </label>
            <Select
              value={reminderOffset}
              onValueChange={(val) => setReminderOffset(val as ReminderOffset)}
              disabled={!dueDate}
            >
              <SelectTrigger id="task-reminder" className="text-xs sm:text-sm">
                <SelectValue
                  placeholder={dueDate ? 'Select reminder time' : 'Set due date first'}
                />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="none">No reminder</SelectItem>
                <SelectItem value="10m">10 minutes before</SelectItem>
                <SelectItem value="30m">30 minutes before</SelectItem>
                <SelectItem value="1h">1 hour before</SelectItem>
                <SelectItem value="1d">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4 gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel} className="text-xs sm:text-sm">
          Cancel
        </Button>
        <Button type="submit" className="text-xs sm:text-sm">
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function TaskFormDialog({ open, onOpenChange, onSubmit, taskToEdit }: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-h-[92vh] w-[94vw] max-w-[520px] overflow-y-auto rounded-2xl border-white/50 bg-white/90 p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6 dark:border-white/15 dark:bg-slate-900/90">
        {open && (
          <TaskFormInner
            key={taskToEdit ? taskToEdit.id : 'new-task'}
            taskToEdit={taskToEdit}
            onSubmit={(data) => {
              onSubmit(data);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
