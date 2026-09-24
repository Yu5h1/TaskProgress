// Reads private decision counts only from a local Report's matching scope.
export async function loadDecisionSummary(scope, fetchImpl = fetch) {
  const response = await fetchImpl(`/__taskprogress/v1/decisions/${encodeURIComponent(scope)}`, {
    method:"POST", headers:{"Content-Type":"application/json","X-TaskProgress-Editor":"1"}, body:"{}"
  });
  if (!response.ok) throw new Error(`決策清單無法讀取（${response.status}）`);
  const result = await response.json();
  if (!result.ok || !Array.isArray(result.files)) throw new Error("決策清單回應無效");
  return Object.fromEntries(result.files.map(file => [file.task_id, {
    href:`/decisions/?scope=${encodeURIComponent(scope)}&task=${encodeURIComponent(file.task_id)}`,
    label:file.error ? "決策資料錯誤" : `待決策 ${file.pending}`,
    error:file.error ?? null
  }]));
}
