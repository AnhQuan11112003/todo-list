import { ReminderOffset } from '@/types/task';

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
