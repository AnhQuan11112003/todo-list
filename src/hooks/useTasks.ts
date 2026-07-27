'use client';

import { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import { Task, TaskFormData, TaskFiltersState, TaskStatsData, TaskStatus } from '@/types/task';
import { INITIAL_TASKS } from '@/lib/constants';
import {
  calculateReminderTime,
  getNotificationPermission,
  getReminderLabel,
  isNotificationSupported,
  requestNotificationPermission,
  sendOSNotification,
} from '@/lib/notifications';
import { toast } from 'sonner';

const STORAGE_KEY = 'todo_app_tasks_v1';

function emptySubscribe() {
  return () => {};
}

function subscribePermission(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('focus', onStoreChange);
  return () => window.removeEventListener('focus', onStoreChange);
}

function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function useNotificationPermission() {
  return useSyncExternalStore(
    subscribePermission,
    getNotificationPermission,
    () => 'unsupported' as const
  );
}

function getSavedTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
  }
  return INITIAL_TASKS;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(getSavedTasks);
  const isHydrated = useIsHydrated();
  const notificationPermission = useNotificationPermission();

  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    status: 'all',
    priority: 'all',
  });

  const requestPermission = useCallback(async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      toast.success('OS Notifications enabled successfully!');
      sendOSNotification('TaskFlow Notifications Enabled', {
        body: 'You will receive Web Push / OS reminders when your task deadlines approach.',
      });
    } else if (res === 'denied') {
      toast.error('Notification permission was blocked in your browser settings.');
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
    }
  }, [tasks, isHydrated]);

  // Background reminder checker interval (checks every 10 seconds)
  useEffect(() => {
    if (!isHydrated) return;

    const checkReminders = () => {
      const currentTime = new Date().getTime();

      setTasks((prevTasks) => {
        const notificationsToFire: { title: string; body: string }[] = [];
        let hasChanges = false;

        const updated = prevTasks.map((task) => {
          // Skip completed tasks or tasks with no reminder set or already notified
          if (
            task.status === 'completed' ||
            !task.dueDate ||
            !task.reminderOffset ||
            task.reminderOffset === 'none' ||
            task.reminderSent
          ) {
            return task;
          }

          const reminderTime = calculateReminderTime(task.dueDate, task.reminderOffset);
          if (!reminderTime) return task;

          const reminderMs = reminderTime.getTime();
          const dueMs = new Date(task.dueDate).getTime();

          // Check if current time has reached or passed reminder time (within 15 minutes window)
          if (currentTime >= reminderMs && currentTime <= dueMs + 15 * 60 * 1000) {
            hasChanges = true;
            const timeLabel = getReminderLabel(task.reminderOffset);

            notificationsToFire.push({
              title: `⏰ Task Reminder: ${task.title}`,
              body: `Due at ${new Date(task.dueDate).toLocaleString()} (${timeLabel})`,
            });

            return {
              ...task,
              reminderSent: true,
            };
          }

          return task;
        });

        if (hasChanges) {
          // Trigger side-effects asynchronously outside state calculation
          setTimeout(() => {
            notificationsToFire.forEach((notif) => {
              sendOSNotification(notif.title, { body: notif.body });
              toast.warning(notif.title, {
                description: notif.body,
                duration: 8000,
              });
            });
          }, 0);

          return updated;
        }

        return prevTasks;
      });
    };

    // Run initial check
    checkReminders();

    // Check every 10s
    const intervalId = setInterval(checkReminders, 10000);
    return () => clearInterval(intervalId);
  }, [isHydrated]);

  // Create Task
  const addTask = useCallback((data: TaskFormData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `task-${Date.now()}`,
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      reminderOffset: data.reminderOffset ?? 'none',
      reminderSent: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created successfully!');

    // Check if permission is default and remind user to enable notifications if reminder offset is selected
    if (
      data.reminderOffset &&
      data.reminderOffset !== 'none' &&
      isNotificationSupported() &&
      Notification.permission === 'default'
    ) {
      toast.info('Enable OS Notifications to receive push alerts when tasks are due!', {
        action: {
          label: 'Enable Now',
          onClick: () => requestNotificationPermission(),
        },
      });
    }

    return newTask;
  }, []);

  // Update Task
  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const newDueDate =
          data.dueDate !== undefined
            ? data.dueDate
              ? new Date(data.dueDate).toISOString()
              : undefined
            : task.dueDate;
        const newReminderOffset =
          data.reminderOffset !== undefined ? data.reminderOffset : task.reminderOffset;

        // Reset reminderSent if dueDate or reminderOffset changes
        const dueDateChanged = newDueDate !== task.dueDate;
        const reminderChanged = newReminderOffset !== task.reminderOffset;
        const resetReminderSent = dueDateChanged || reminderChanged ? false : task.reminderSent;

        return {
          ...task,
          ...data,
          title: data.title !== undefined ? data.title.trim() : task.title,
          description: data.description !== undefined ? data.description.trim() : task.description,
          dueDate: newDueDate,
          reminderOffset: newReminderOffset,
          reminderSent: resetReminderSent,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    toast.success('Task updated successfully!');
  }, []);

  // Delete Task
  const deleteTask = useCallback((id: string) => {
    let deletedTaskTitle = '';
    setTasks((prev) => {
      const taskToDelete = prev.find((t) => t.id === id);
      if (taskToDelete) {
        deletedTaskTitle = taskToDelete.title;
      }
      return prev.filter((t) => t.id !== id);
    });
    toast.success(`Deleted task: "${deletedTaskTitle || 'Task'}"`);
  }, []);

  // Toggle Status (Completed <-> Todo / In-Progress)
  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Filter tasks based on current filters state
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search match
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status match
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Priority match
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  // Compute Task Stats
  const stats: TaskStatsData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const active = todo + inProgress;
    const lowPriority = tasks.filter((t) => t.priority === 'low').length;
    const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
    const highPriority = tasks.filter((t) => t.priority === 'high').length;

    return {
      total,
      active,
      completed,
      todo,
      inProgress,
      lowPriority,
      mediumPriority,
      highPriority,
    };
  }, [tasks]);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
    });
  }, []);

  return {
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
  };
}
