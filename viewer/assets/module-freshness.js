// Compare declared dependencies against the projections actually consumed, without persisting dirty flags.
const revision = /^sha256:[a-f0-9]{64}$/;
export function projectionMetadataErrors(value) {
  const errors = [];
  for (const key of ["content_revision", "source_revision", "report_revision"])
    if (value?.[key] !== undefined && (typeof value[key] !== "string" || !revision.test(value[key]))) errors.push(key);
  if (value?.input_modules !== undefined) {
    const inputs = value.input_modules;
    if (!Array.isArray(inputs) || inputs.some(input => !input || typeof input.module_type !== "string"
      || typeof input.content_revision !== "string" || !revision.test(input.content_revision))
      || new Set(inputs.map(input => input.module_type)).size !== inputs.length) errors.push("input_modules");
  }
  if (value?.excluded_modules !== undefined && (!Array.isArray(value.excluded_modules)
    || value.excluded_modules.some(type => typeof type !== "string"))) errors.push("excluded_modules");
  return errors;
}
export function evaluateModuleDependencies(entries) {
  const byType = new Map(entries.map(entry => [entry.type, entry]));
  const result = new Map();
  const reaches = (current, target, seen = new Set()) => {
    if (seen.has(current)) return false;
    seen.add(current);
    return (byType.get(current)?.dependsOn ?? []).some(type => type === target || reaches(type, target, seen));
  };
  const disabled = new Set(entries.filter(entry => reaches(entry.type, entry.type)).map(entry => entry.type));
  const visit = entry => {
    if (result.has(entry.type)) return result.get(entry.type);
    if (disabled.has(entry.type)) {
      const value = { stale: true, excluded: [], reason: "cycle" }; result.set(entry.type, value); return value;
    }
    const excluded = [];
    const expected = new Map();
    for (const type of entry.dependsOn ?? []) {
      const upstream = byType.get(type);
      if (!upstream || visit(upstream).stale || !revision.test(upstream.data?.content_revision ?? "")) excluded.push(type);
      else expected.set(type, upstream.data.content_revision);
    }
    const invalid = projectionMetadataErrors(entry.data).length > 0;
    const receipts = entry.data?.input_modules;
    const legacy = entry.data?.content_revision === undefined && receipts === undefined;
    const recorded = new Map((Array.isArray(receipts) ? receipts : []).filter(Boolean).map(input => [input.module_type, input.content_revision]));
    const changed = expected.size !== recorded.size || [...expected].some(([type, value]) => recorded.get(type) !== value);
    const value = { stale: invalid || (changed && !legacy) || (legacy && (entry.dependsOn?.length ?? 0) > 0),
      excluded: [...new Set([...excluded, ...(Array.isArray(entry.data?.excluded_modules) ? entry.data.excluded_modules.filter(type => typeof type === "string") : [])])],
      reason: invalid ? "invalid" : legacy ? "unknown" : changed ? "changed" : "current" };
    result.set(entry.type, value); return value;
  };
  entries.forEach(visit);
  return result;
}
