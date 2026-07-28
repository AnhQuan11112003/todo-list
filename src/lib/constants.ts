import { Task } from '@/types/task';

// Set sample due dates relative to current time
const now = Date.now();
const tomorrow = new Date(now + 24 * 3600000).toISOString().slice(0, 16);
const nextWeek = new Date(now + 7 * 24 * 3600000).toISOString().slice(0, 16);

export const INITIAL_PROJECTS = ['Work', 'Personal', 'Development', 'Design', 'Study'];
export const INITIAL_TAGS = ['frontend', 'urgent', 'bug', 'feature', 'learning', 'ui-ux'];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Next.js Todo Application',
    description:
      'Implement full CRUD functionality, shadcn/ui components, Web Push notifications, filters, search, and localStorage persistence.',
    status: 'in-progress',
    priority: 'high',
    project: 'Development',
    tags: ['frontend', 'feature', 'urgent'],
    dueDate: tomorrow,
    reminderOffset: '30m',
    reminderSent: false,
    createdAt: new Date(now - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(now - 3600000 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design Responsive UI with Tailwind & shadcn',
    description:
      'Ensure smooth experience on mobile, tablet, and desktop viewports with accessible components.',
    status: 'completed',
    priority: 'medium',
    project: 'Design',
    tags: ['ui-ux', 'frontend'],
    createdAt: new Date(now - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(now - 3600000 * 24).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Write Unit & E2E Verification Tests',
    description:
      'Run npm run lint and npm run build to ensure zero errors or warnings before deployment.',
    status: 'todo',
    priority: 'low',
    project: 'Work',
    tags: ['feature'],
    dueDate: nextWeek,
    reminderOffset: '1d',
    reminderSent: false,
    createdAt: new Date(now - 3600000 * 12).toISOString(),
    updatedAt: new Date(now - 3600000 * 12).toISOString(),
  },
];

