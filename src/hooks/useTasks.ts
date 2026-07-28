'use client';

import { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import { Task, TaskFormData, TaskFiltersState, TaskStatsData, TaskStatus, SnoozeDuration } from '@/types/task';
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_TAGS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { mapRowToTask, mapTaskToInsertRow, mapTaskToUpdateRow, SupabaseTaskRow } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
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
const PROJECTS_STORAGE_KEY = 'todo_app_projects_v1';
const TAGS_STORAGE_KEY = 'todo_app_tags_v1';

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

function getLocalTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to read local tasks:', err);
  }
  return INITIAL_TASKS;
}

function getLocalProjects(): string[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read local projects:', err);
  }
  return INITIAL_PROJECTS;
}

function getLocalTags(): string[] {
  if (typeof window === 'undefined') return INITIAL_TAGS;
  try {
    const saved = localStorage.getItem(TAGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read local tags:', err);
  }
  return INITIAL_TAGS;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(getLocalTasks);
  const [customProjects, setCustomProjects] = useState<string[]>(getLocalProjects);
  const [customTags, setCustomTags] = useState<string[]>(getLocalTags);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isHydrated = useIsHydrated();
  const notificationPermission = useNotificationPermission();
  const supabase = useMemo(() => createClient(), []);

  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    status: 'all',
    priority: 'all',
    project: 'all',
    tag: 'all',
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

  // Fetch tasks from Supabase
  const fetchSupabaseTasks = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks from Supabase:', error);
          return;
        }

        if (data) {
          const mappedTasks = (data as SupabaseTaskRow[]).map(mapRowToTask);
          setTasks(mappedTasks);
        }
      } catch (err) {
        console.error('Failed to load tasks from Supabase:', err);
      }
    },
    [supabase]
  );

  // Migrate LocalStorage Tasks to Supabase
  const migrateLocalStorageToSupabase = useCallback(
    async (userId: string) => {
      if (typeof window === 'undefined') return;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const localTasks: Task[] = JSON.parse(saved);
        if (!Array.isArray(localTasks) || localTasks.length === 0) return;

        toast.info('Đang chuyển đổi dữ liệu từ localStorage lên tài khoản Supabase...');

        const rowsToInsert = localTasks.map((t) => mapTaskToInsertRow(t, userId));

        const { error } = await supabase.from('tasks').insert(rowsToInsert);

        if (error) {
          console.error('Error migrating tasks to Supabase:', error);
          toast.error(`Lỗi chuyển đổi dữ liệu: ${error.message}`);
        } else {
          // Clear local storage after successful migration to prevent duplicate imports
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(PROJECTS_STORAGE_KEY);
          localStorage.removeItem(TAGS_STORAGE_KEY);

          toast.success(`Đã chuyển ${localTasks.length} task từ localStorage lên Supabase thành công!`);
          await fetchSupabaseTasks(userId);
        }
      } catch (err) {
        console.error('Migration failed:', err);
      }
    },
    [supabase, fetchSupabaseTasks]
  );

  // Listen to Supabase Auth state change
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsAuthLoading(false);
      if (user) {
        migrateLocalStorageToSupabase(user.id).then(() => fetchSupabaseTasks(user.id));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthLoading(false);

      if (event === 'SIGNED_IN' && currentUser) {
        await migrateLocalStorageToSupabase(currentUser.id);
        await fetchSupabaseTasks(currentUser.id);
      } else if (event === 'SIGNED_OUT') {
        setTasks(getLocalTasks());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchSupabaseTasks, migrateLocalStorageToSupabase]);

  // Sync to localStorage only if user is NOT logged in
  useEffect(() => {
    if (!isHydrated || user) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save local tasks:', err);
    }
  }, [tasks, isHydrated, user]);

  useEffect(() => {
    if (!isHydrated || user) return;
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(customProjects));
    } catch (err) {
      console.error('Failed to save local projects:', err);
    }
  }, [customProjects, isHydrated, user]);

  useEffect(() => {
    if (!isHydrated || user) return;
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(customTags));
    } catch (err) {
      console.error('Failed to save local tags:', err);
    }
  }, [customTags, isHydrated, user]);

  // Compute all available unique projects and tags
  const allProjects = useMemo(() => {
    const set = new Set<string>([...INITIAL_PROJECTS, ...customProjects]);
    tasks.forEach((t) => {
      if (t.project?.trim()) set.add(t.project.trim());
    });
    return Array.from(set).sort();
  }, [customProjects, tasks]);

  const allTags = useMemo(() => {
    const set = new Set<string>([...INITIAL_TAGS, ...customTags]);
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => {
        if (tag.trim()) set.add(tag.trim().toLowerCase());
      });
    });
    return Array.from(set).sort();
  }, [customTags, tasks]);

  // Add Custom Project
  const addProject = useCallback((projectName: string) => {
    const trimmed = projectName.trim();
    if (!trimmed) return;
    setCustomProjects((prev) => {
      if (prev.some((p) => p.toLowerCase() === trimmed.toLowerCase())) return prev;
      toast.success(`Project "${trimmed}" added!`);
      return [...prev, trimmed];
    });
  }, []);

  // Delete Project
  const deleteProject = useCallback(
    async (projectName: string) => {
      const trimmed = projectName.trim();
      if (!trimmed) return;

      setCustomProjects((prev) => prev.filter((p) => p.toLowerCase() !== trimmed.toLowerCase()));
      setTasks((prev) =>
        prev.map((t) => (t.project === trimmed ? { ...t, project: undefined } : t))
      );
      setFilters((prev) => (prev.project === trimmed ? { ...prev, project: 'all' } : prev));

      if (user) {
        await supabase
          .from('tasks')
          .update({ project: null })
          .eq('project', trimmed)
          .eq('user_id', user.id);
      }

      toast.success(`Deleted project "${trimmed}"`);
    },
    [user, supabase]
  );

  // Add Custom Tag
  const addTag = useCallback((tagName: string) => {
    const trimmed = tagName.trim().toLowerCase();
    if (!trimmed) return;
    setCustomTags((prev) => {
      if (prev.includes(trimmed)) return prev;
      toast.success(`Tag "#${trimmed}" added!`);
      return [...prev, trimmed];
    });
  }, []);

  // Delete Tag
  const deleteTag = useCallback(
    async (tagName: string) => {
      const trimmed = tagName.trim().toLowerCase();
      if (!trimmed) return;

      setCustomTags((prev) => prev.filter((t) => t.toLowerCase() !== trimmed));
      setTasks((prev) =>
        prev.map((t) =>
          t.tags && t.tags.includes(trimmed)
            ? { ...t, tags: t.tags.filter((tag) => tag !== trimmed) }
            : t
        )
      );
      setFilters((prev) => (prev.tag === trimmed ? { ...prev, tag: 'all' } : prev));

      toast.success(`Deleted tag "#${trimmed}"`);
    },
    []
  );

  // Background reminder checker interval (checks every 10 seconds)
  useEffect(() => {
    if (!isHydrated) return;

    const checkReminders = () => {
      const currentTime = new Date().getTime();

      setTasks((prevTasks) => {
        const notificationsToFire: { taskId: string; title: string; body: string }[] = [];
        let hasChanges = false;

        const updated = prevTasks.map((task) => {
          if (task.status === 'completed') return task;

          // Check snoozed task first
          if (task.snoozedUntil) {
            const snoozeMs = new Date(task.snoozedUntil).getTime();
            if (!isNaN(snoozeMs) && currentTime >= snoozeMs) {
              hasChanges = true;
              notificationsToFire.push({
                taskId: task.id,
                title: `⏰ Snoozed Reminder: ${task.title}`,
                body: `Snooze finished. Task deadline: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}`,
              });

              return {
                ...task,
                snoozedUntil: undefined,
                reminderSent: true,
              };
            }
            return task;
          }

          if (!task.dueDate || !task.reminderOffset || task.reminderOffset === 'none' || task.reminderSent) {
            return task;
          }

          const reminderTime = calculateReminderTime(task.dueDate, task.reminderOffset);
          if (!reminderTime) return task;

          const reminderMs = reminderTime.getTime();
          const dueMs = new Date(task.dueDate).getTime();

          if (currentTime >= reminderMs && currentTime <= dueMs + 15 * 60 * 1000) {
            hasChanges = true;
            const timeLabel = getReminderLabel(task.reminderOffset);

            notificationsToFire.push({
              taskId: task.id,
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
          setTimeout(() => {
            notificationsToFire.forEach((notif) => {
              sendOSNotification(notif.title, { body: notif.body });
              toast.warning(notif.title, {
                description: notif.body,
                duration: 10000,
                action: {
                  label: 'Snooze 30m 💤',
                  onClick: () => snoozeTask(notif.taskId, '30m'),
                },
              });
            });
          }, 0);

          return updated;
        }

        return prevTasks;
      });
    };

    checkReminders();
    const intervalId = setInterval(checkReminders, 10000);
    return () => clearInterval(intervalId);
  }, [isHydrated]);

  // Snooze Task
  const snoozeTask = useCallback(
    async (id: string, duration: SnoozeDuration | number) => {
      const { calculateSnoozeDate, getSnoozeLabel } = require('@/lib/notifications');
      const snoozedUntilDate = calculateSnoozeDate(duration);
      const label = getSnoozeLabel(duration);
      const snoozedUntilISO = snoozedUntilDate.toISOString();

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          return {
            ...task,
            snoozedUntil: snoozedUntilISO,
            reminderSent: false,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (user) {
        await supabase
          .from('tasks')
          .update({
            snoozed_until: snoozedUntilISO,
            reminder_sent: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);
      }

      const formattedTime = snoozedUntilDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedDate = snoozedUntilDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

      toast.info(`Task snoozed: ${label}`, {
        description: `Reminder postponed to ${formattedDate} at ${formattedTime}`,
      });
    },
    [user, supabase]
  );

  // Cancel Snooze
  const cancelSnooze = useCallback(
    async (id: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          return {
            ...task,
            snoozedUntil: undefined,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (user) {
        await supabase
          .from('tasks')
          .update({
            snoozed_until: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);
      }

      toast.success('Snooze cancelled');
    },
    [user, supabase]
  );

  // Create Task
  const addTask = useCallback(
    async (data: TaskFormData) => {
      const now = new Date().toISOString();
      const tempId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `task-${Date.now()}`;

      const newTask: Task = {
        id: tempId,
        title: data.title.trim(),
        description: data.description.trim(),
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        reminderOffset: data.reminderOffset ?? 'none',
        project: data.project?.trim() || undefined,
        tags: data.tags ? data.tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
        reminderSent: false,
        createdAt: now,
        updatedAt: now,
      };

      if (data.project?.trim()) addProject(data.project.trim());
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => addTag(tag));
      }

      // Immediate UI update
      setTasks((prev) => [newTask, ...prev]);

      if (user) {
        const payload = mapTaskToInsertRow(newTask, user.id);
        const { data: inserted, error } = await supabase
          .from('tasks')
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.error('Error inserting task to Supabase:', error);
          toast.error(`Lỗi tạo task trên Supabase: ${error.message}`);
        } else if (inserted) {
          const realTask = mapRowToTask(inserted as SupabaseTaskRow);
          setTasks((prev) => prev.map((t) => (t.id === tempId ? realTask : t)));
        }
      }

      toast.success('Task created successfully!');
      return newTask;
    },
    [user, supabase, addProject, addTag]
  );

  // Update Task
  const updateTask = useCallback(
    async (id: string, data: Partial<TaskFormData>) => {
      if (data.project?.trim()) addProject(data.project.trim());
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => addTag(tag));
      }

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

          const dueDateChanged = newDueDate !== task.dueDate;
          const reminderChanged = newReminderOffset !== task.reminderOffset;
          const resetReminderSent = dueDateChanged || reminderChanged ? false : task.reminderSent;

          return {
            ...task,
            ...data,
            title: data.title !== undefined ? data.title.trim() : task.title,
            description: data.description !== undefined ? data.description.trim() : task.description,
            project: data.project !== undefined ? (data.project.trim() || undefined) : task.project,
            tags: data.tags !== undefined ? data.tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : task.tags,
            dueDate: newDueDate,
            reminderOffset: newReminderOffset,
            reminderSent: resetReminderSent,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (user) {
        const updatePayload = mapTaskToUpdateRow(data);
        const { error } = await supabase
          .from('tasks')
          .update(updatePayload)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating task in Supabase:', error);
          toast.error(`Lỗi cập nhật Supabase: ${error.message}`);
        }
      }

      toast.success('Task updated successfully!');
    },
    [user, supabase, addProject, addTag]
  );

  // Delete Task
  const deleteTask = useCallback(
    async (id: string) => {
      let deletedTaskTitle = '';
      setTasks((prev) => {
        const taskToDelete = prev.find((t) => t.id === id);
        if (taskToDelete) {
          deletedTaskTitle = taskToDelete.title;
        }
        return prev.filter((t) => t.id !== id);
      });

      if (user) {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting task from Supabase:', error);
          toast.error(`Lỗi xóa task trên Supabase: ${error.message}`);
        }
      }

      toast.success(`Deleted task: "${deletedTaskTitle || 'Task'}"`);
    },
    [user, supabase]
  );

  // Toggle Status
  const toggleTaskStatus = useCallback(
    async (id: string) => {
      let nextStatus: TaskStatus = 'completed';

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          nextStatus = task.status === 'completed' ? 'todo' : 'completed';
          return {
            ...task,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (user) {
        await supabase
          .from('tasks')
          .update({
            status: nextStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);
      }
    },
    [user, supabase]
  );

  // Filter tasks based on current filters state
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesProject = task.project?.toLowerCase().includes(query);
        const matchesTag = task.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesProject && !matchesTag) return false;
      }

      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.project !== 'all' && task.project !== filters.project) return false;
      if (filters.tag !== 'all' && (!task.tags || !task.tags.includes(filters.tag))) return false;

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
      project: 'all',
      tag: 'all',
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info('Đã đăng xuất khỏi tài khoản Supabase');
  }, [supabase]);

  return {
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
  };
}
