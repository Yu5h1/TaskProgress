(function initializeItemStatusPolicy(global) {
  const tasks = Object.freeze({
    planned: { label: '待處理', tone: 'neutral' },
    in_progress: { label: '進行中', tone: 'active' },
    blocked: { label: '受阻', tone: 'danger' },
    done: { label: '已完成', tone: 'success' },
    archive: { label: '已封存', tone: 'muted' },
  });
  const items = Object.freeze({ ...tasks,
    obsolete: { label: '已取代', tone: 'obsolete' },
    discontinued: { label: '已棄案', tone: 'discontinued' },
  });
  const retired = Object.freeze(['obsolete', 'discontinued']);
  function prepare(status, retirement) {
    if (!Object.hasOwn(items, status)) throw new Error(`不支援的子項目狀態「${status}」。`);
    if (!retired.includes(status)) return { status };
    if (status === 'discontinued') {
      const reason = String(retirement?.reason ?? '').trim();
      if (!reason || reason.length > 300) throw new Error('請填寫 1–300 字的棄案理由。');
      return { status, retirement: { reason } };
    }
    const target = retirement?.replaced_by;
    const reason = retirement?.reason === undefined ? undefined : String(retirement.reason).trim();
    if (reason !== undefined && (!reason || reason.length > 300)) throw new Error('補充理由需為 1–300 字。');
    const details = reason ? { reason } : {};
    if (target && typeof target.document === 'string' && target.document.trim()) {
      const document = target.document.trim();
      const path = document.split('#',1)[0];
      if (!path || document.length > 300 || /^(?:[\\/]|[a-z]:)/iu.test(document) || path.split(/[\\/]/u).includes('..')) throw new Error('請填寫此範圍內的相對文件路徑。');
      return { status, retirement: { replaced_by: { document }, ...details } };
    }
    if (!target || !['scope_id','task_id','item_id'].every(key => typeof target[key] === 'string' && target[key].trim())) throw new Error('請填寫完整的取代項目參照：scope › card › item。');
    return { status, retirement: { replaced_by: Object.fromEntries(['scope_id','task_id','item_id'].map(key => [key,target[key].trim()])), ...details } };
  }
  global.TaskProgressItemStatusPolicy = Object.freeze({ tasks, items, retired, prepare });
}(globalThis));
