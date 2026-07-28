import { ReminderOffset, SnoozeDuration } from '@/types/task';

export type NotificationPermissionState = NotificationPermission | 'unsupported';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

export function calculateReminderTime(dueDateISO: string, offset: ReminderOffset): Date | null {
  if (!dueDateISO || offset === 'none') return null;

  const due = new Date(dueDateISO);
  if (isNaN(due.getTime())) return null;

  const dueMs = due.getTime();
  let offsetMs = 0;

  switch (offset) {
    case '10m':
      offsetMs = 10 * 60 * 1000;
      break;
    case '30m':
      offsetMs = 30 * 60 * 1000;
      break;
    case '1h':
      offsetMs = 60 * 60 * 1000;
      break;
    case '1d':
      offsetMs = 24 * 60 * 60 * 1000;
      break;
    default:
      return null;
  }

  return new Date(dueMs - offsetMs);
}

export function calculateSnoozeDate(duration: SnoozeDuration | number): Date {
  const now = new Date();
  if (typeof duration === 'number') {
    return new Date(now.getTime() + Math.max(1, duration) * 60 * 1000);
  }

  switch (duration) {
    case '10m':
      return new Date(now.getTime() + 10 * 60 * 1000);
    case '30m':
      return new Date(now.getTime() + 30 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000);
    case '2h':
      return new Date(now.getTime() + 2 * 60 * 60 * 1000);
    case '4h':
      return new Date(now.getTime() + 4 * 60 * 60 * 1000);
    case 'tonight': {
      const tonight = new Date(now);
      tonight.setHours(20, 0, 0, 0);
      if (tonight.getTime() <= now.getTime()) {
        tonight.setTime(now.getTime() + 3 * 60 * 60 * 1000);
      }
      return tonight;
    }
    case 'tomorrow-morning': {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    }
    case 'tomorrow-afternoon': {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      return tomorrow;
    }
    case 'next-week': {
      const nextMon = new Date(now);
      const day = nextMon.getDay();
      const diff = day === 0 ? 1 : 8 - day;
      nextMon.setDate(nextMon.getDate() + diff);
      nextMon.setHours(9, 0, 0, 0);
      return nextMon;
    }
    default:
      return new Date(now.getTime() + 15 * 60 * 1000);
  }
}

export function getSnoozeLabel(duration: SnoozeDuration | number): string {
  if (typeof duration === 'number') {
    return `${duration} minute${duration > 1 ? 's' : ''}`;
  }
  switch (duration) {
    case '10m':
      return '10 minutes';
    case '30m':
      return '30 minutes';
    case '1h':
      return '1 hour';
    case '2h':
      return '2 hours';
    case '4h':
      return '4 hours';
    case 'tonight':
      return 'Tonight (8:00 PM)';
    case 'tomorrow-morning':
      return 'Tomorrow Morning (9:00 AM)';
    case 'tomorrow-afternoon':
      return 'Tomorrow Afternoon (2:00 PM)';
    case 'next-week':
      return 'Next Week (Mon 9:00 AM)';
    default:
      return '15 minutes';
  }
}


export function sendOSNotification(title: string, options?: NotificationOptions) {
  if (!isNotificationSupported()) return;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `task-reminder-${Date.now()}`,
        requireInteraction: true,
        ...options,
      });

      notification.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
      };
    } catch (err) {
      console.error('Failed to dispatch OS Notification:', err);
    }
  }
}

export function getReminderLabel(offset: ReminderOffset): string {
  switch (offset) {
    case '10m':
      return '10 minutes before';
    case '30m':
      return '30 minutes before';
    case '1h':
      return '1 hour before';
    case '1d':
      return '1 day before';
    case 'none':
    default:
      return 'No reminder';
  }
}

