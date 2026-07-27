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
        <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Update your task details, deadline, and notification reminders.'
            : 'Add a new task to your list. Set due dates and reminders.'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid max-h-[70vh] gap-4 overflow-y-auto py-4 pr-1">
        {/* Title input */}
        <div className="grid gap-2">
          <label htmlFor="task-title" className="text-foreground text-sm font-medium">
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
            className={titleError ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
            autoFocus
          />
          {titleError && (
            <div className="flex items-center gap-1 text-xs font-medium text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{titleError}</span>
            </div>
          )}
        </div>

        {/* Description textarea */}
        <div className="grid gap-2">
          <label htmlFor="task-description" className="text-foreground text-sm font-medium">
            Description
          </label>
          <Textarea
            id="task-description"
            placeholder="Add additional notes or details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Status & Priority selects */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="task-status" className="text-foreground text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
              <SelectTrigger id="task-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="task-priority" className="text-foreground text-sm font-medium">
              Priority
            </label>
            <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
              <SelectTrigger id="task-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date & Reminder selects */}
        <div className="border-border/60 grid grid-cols-1 gap-4 border-t pt-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <label
              htmlFor="task-duedate"
              className="text-foreground flex items-center gap-1.5 text-sm font-medium"
            >
              <Calendar className="text-primary h-3.5 w-3.5" />
              Due Date &amp; Time
            </label>
            <Input
              id="task-duedate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="task-reminder"
              className="text-foreground flex items-center gap-1.5 text-sm font-medium"
            >
              <Bell className="h-3.5 w-3.5 text-amber-500" />
              Web Push Reminder
            </label>
            <Select
              value={reminderOffset}
              onValueChange={(val) => setReminderOffset(val as ReminderOffset)}
              disabled={!dueDate}
            >
              <SelectTrigger id="task-reminder">
                <SelectValue
                  placeholder={dueDate ? 'Select reminder time' : 'Set due date first'}
                />
              </SelectTrigger>
              <SelectContent>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? 'Save Changes' : 'Create Task'}</Button>
      </DialogFooter>
    </form>
  );
}

export function TaskFormDialog({ open, onOpenChange, onSubmit, taskToEdit }: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
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
