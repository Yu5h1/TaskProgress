import { isRetiredStatus } from './item-state.js';
import { terminalActivityTime } from './item-activity.js';

/** Presentation only: retired rows retain their legal raw field and editing identity. */
export function taskItemStack(task) {
  const pending = task.pending_items ?? [];
  const closed = [
    ...(task.completed_items ?? []).map(item => ({ item, field: 'completed_items' })),
    ...pending.filter(item => isRetiredStatus(item.status)).map(item => ({ item, field: 'pending_items' })),
  ];
  // Old rows without terminal evidence keep their source order; never invent a historic date.
  closed.sort((a, b) => terminalActivityTime(b.item) - terminalActivityTime(a.item));
  return { pending: pending.filter(item => !isRetiredStatus(item.status)), closed };
}
