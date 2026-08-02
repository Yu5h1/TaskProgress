export const fixtureReport = Object.freeze({
  schema_version: "1.0",
  report_id: "svelte-editor-spike",
  scope_id: "svelte-editor-spike",
  title: "Svelte Editor Spike",
  updated_at: "2026-08-02T00:00:00+08:00",
  tasks: [
    {
      id: "editor-framework-spike",
      title: "驗證 Svelte 任務卡",
      status: "in_progress",
      priority: 1,
      summary: "使用正式 Editor Core 驗證元件化介面，不修改 Viewer 或 report.json。",
      completed_items: [
        { id: "core-ready", title: "共用 Editor Core", priority: 0 },
      ],
      pending_items: [
        { id: "svelte-parity", title: "Svelte TaskCard parity", priority: 1 },
        { id: "decision-record", title: "記錄框架決策", priority: 2 },
      ],
    },
  ],
});
