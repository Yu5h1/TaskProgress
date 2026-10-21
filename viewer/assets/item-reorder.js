/** Moves one unfinished child item next to another by stable ID, on a copy of the raw report; nothing else changes. */
export function moveUnfinishedItem(report, { taskId, itemId, position }) {
  const keys = Object.keys(position ?? {});
  if (keys.length !== 1 || !["before", "after"].includes(keys[0])) {
    throw new Error("子項目位置必須且只能指定 before 或 after。");
  }
  const targetId = position[keys[0]];
  if (targetId === itemId) throw new Error("子項目不能以自己為位置參照。");
  const next = structuredClone(report);
  const task = next.tasks?.find(entry => entry?.id === taskId);
  if (!task) throw new Error(`找不到任務「${taskId}」。`);
  const items = task.pending_items ?? [];
  const isItem = id => entry => entry && typeof entry === "object" && entry.id === id;
  const sourceIndex = items.findIndex(isItem(itemId));
  if (sourceIndex < 0) throw new Error(`找不到待處理子項目「${itemId}」。`);
  if (items.findIndex(isItem(targetId)) < 0) throw new Error(`找不到待處理子項目「${targetId}」。`);
  const [item] = items.splice(sourceIndex, 1);
  const targetIndex = items.findIndex(isItem(targetId));
  items.splice(keys[0] === "after" ? targetIndex + 1 : targetIndex, 0, item);
  return next;
}
