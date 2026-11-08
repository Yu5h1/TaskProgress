import { taskPriority } from './report-model.js';
import { moveVisibleCard } from './card-order.js';

// Card movement and display share the card's own priority key.
export function cardPriorityGroup(task) {
  return String(taskPriority(task));
}

/** Reorders only the participating source slots; priority and all card contents stay unchanged. */
export function moveReportCard(report, { taskId, position, visibleIds }) {
  const keys = Object.keys(position ?? {});
  if (keys.length !== 1 || !['before', 'after'].includes(keys[0])) throw new Error('卡片位置必須且只能指定 before 或 after。');
  const targetId = position[keys[0]];
  if (taskId === targetId) throw new Error('卡片不能以自己為位置參照。');
  const tasks = report.tasks ?? [], byId = new Map(tasks.map(task => [task.id, task]));
  const source = byId.get(taskId), target = byId.get(targetId);
  if (!source || !target) throw new Error('找不到換位的任務卡。');
  const group = cardPriorityGroup(source);
  if (cardPriorityGroup(target) !== group) throw new Error('只能在相同優先級之間換位。');
  const ids = visibleIds ?? tasks.filter(task => cardPriorityGroup(task) === group).map(task => task.id);
  if (!Array.isArray(ids) || new Set(ids).size !== ids.length || !ids.includes(taskId) || !ids.includes(targetId)
      || ids.some(id => !byId.has(id) || cardPriorityGroup(byId.get(id)) !== group)) throw new Error('換位卡片集合已變更，請重新操作。');
  const allIds = tasks.map(task => task.id);
  const order = moveVisibleCard(allIds, allIds, ids, taskId, targetId, keys[0] === 'after');
  const next = structuredClone(report), copies = new Map(next.tasks.map(task => [task.id, task]));
  next.tasks = order.map(id => copies.get(id));
  return next;
}
