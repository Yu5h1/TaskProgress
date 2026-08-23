# TaskProgress time estimation

Use this reference to create or update TaskProgress time inputs and the public `time.analysis.json` projection.

## Keep four concepts separate

1. **Engineering demand** estimates how many work minutes the task needs.
2. **Work capacity** estimates how many minutes can be used before delivery.
3. **Execution calibration** adjusts systematic historical estimation bias when evidence is sufficient.
4. **Deadline risk** compares reported work progress with consumed scheduled capacity.

Do not subtract actual sessions from an estimate to maintain remaining work. For v0.3, derive it from the actual unfinished work identities:

```text
unfinished_minutes
= sum(active likely_minutes for unfinished stable items)
× execution_calibration_factor
```

Only when a task has a task-level estimate without item-level estimates may its factual task progress ratio apportion the remaining estimate. Legacy v0.2 snapshots may retain the older project-total-times-unfinished-ratio fallback.

## Resolve each item estimate

Use one exclusive result mode per active item estimate so project composition never double-counts work:

1. `manual`: a human directly supplies the final likely duration.
2. `mixed`: human parameters combine with AI analysis, historical evidence, and a registered deterministic formula.
3. `ai`: AI selects and explains an estimate without human parameters; deterministic arithmetic still uses a registered formula when possible.
4. `default`: evidence is insufficient; use `unplanned_item_likely_minutes`, initially 480 minutes, with low confidence and no invented range.

Historical evidence is a contributor, not a fifth exclusive result mode. Use it only when samples are comparable by task type, technology, scale, difficulty, novelty, method, and data quality. Otherwise state that the sample basis is insufficient.

Keep these fields independent:

- `contributors`: who or what influenced the estimate.
- `inputs`: typed values, units, origins, and notes.
- `analysis_method`: how unstructured engineering facts were interpreted.
- `calculation`: registered algorithm ID, formula, version, and explanation.
- `human_confirmed`: whether a human accepted the final result; human input alone does not imply confirmation.

When an input changes but the registered algorithm still applies, rerun the formula without AI. Ask AI again only when the task meaning, input structure, evidence selection, or method applicability changes.

## Aggregate estimates

- Store all durations as integer minutes.
- Sum the active item `likely_minutes` to produce each task total.
- Sum task totals once to produce `total_estimated_minutes`.
- Sum mutually exclusive manual/mixed/ai/default modes to produce `estimate_composition`; its total must equal the project estimate.
- Apply execution calibration only once. With no reliable samples, keep factor `1.0`, effective sample count `0`, and low confidence.
- Preserve stable `task_id` and `item_id`. Create a new versioned `estimate_id` when the estimate changes; link it through `supersedes_estimate_id` rather than overwriting history.

Do not imply precision unsupported by evidence. Include low/likely/high only when the range has an engineering basis.

## Build work capacity

For one executor, derive daily capacity once:

```text
1440
- sleep_minutes_per_day
- life_minutes_per_day
- other_unavailable_minutes_per_day
= capacity_minutes_per_executor_day
```

The initial 8/8/8 profile is 480 minutes sleep, 480 minutes life, and 480 minutes work. These are editable policy inputs, not a personal identity profile.

Generate `capacity_timeline` from `started_at` up to but excluding `delivery_at`:

- include only configured working weekdays;
- apply date exceptions after the weekday rule;
- use `available_minutes: 0` for a full unavailable day;
- use a nonzero exception for partial leave or extra capacity;
- publish only an approved `public_label`, never a private reason.

The Viewer consumes this timeline. It must not subtract sleep, life, weekends, or leave a second time.

## Calculate deadline risk

The current method is `deterministic-capacity-feasibility` v0.3. Keep legacy `deterministic-progress-pressure` v0.2 readable, but do not generate new pressure-only snapshots.

Let:

- `p = work_progress_ratio`, derived from the current TaskProgress item progress;
- `t = elapsed_capacity_minutes / total_capacity_minutes`.
- `r = unfinished_minutes / remaining_capacity_minutes`, when remaining capacity is positive.

For an active deadline, calculate both signals:

```text
progress_pressure_ratio = (1 - p) / (1 - t)
feasibility_ratio = unfinished_minutes / remaining_capacity_minutes
```

Apply capacity feasibility first:

- negative `capacity_balance_minutes` or `r > 1` → `critical`, `capacity_shortfall`;
- `0.8 < r <= 1` → at least `at_risk`, `capacity_tight`;
- otherwise use progress pressure.

Then use the configured progress thresholds and keep the more severe result:

- pressure at or below `on_track_max` → `on_track`;
- pressure at or below `at_risk_max` → `at_risk`;
- higher pressure → `critical`.

Boundary rules take precedence:

- `p >= 1` → `complete`;
- current time at or after `delivery_at` while `p < 1` → `delivery_reached`, `critical`;
- all scheduled capacity consumed while `p < 1` → `capacity_exhausted`, `critical`.

The Viewer recalculates elapsed capacity and the lamp at initialization, every minute, on `pageshow`, and when returning to the foreground. It does not rerun AI or change engineering estimates.

Calculate the capacity balance from the same clock value:

```text
remaining_capacity_minutes = total_capacity_minutes - elapsed_capacity_minutes

capacity_balance_minutes = remaining_capacity_minutes - unfinished_minutes
```

The v0.3 lamp must use this balance. Do not label a project on track when its unfinished engineering demand exceeds remaining real capacity.

## Publish the snapshot

Before writing `time.analysis.json`:

- align scope, task, and item IDs with `report.json`;
- record `as_of`, input update timestamps, method name, and method version;
- include task/item explanations and public references without private reasoning;
- reproduce every aggregate and risk result from the same inputs and clock;
- omit the file entirely when no time analysis was requested or available.

After engineering inputs are ready, use the deterministic Launcher instead of manually reproducing aggregates:

```powershell
& "<task-progress-exe>" analyze "<project-root>"
```

The command reads the base report plus optional config, estimates, and events, then atomically updates the derived snapshot. Missing `delivery_at` is a valid estimate-only result. `open` and `start` automatically run the same projection when any time input exists; Viewer reload only advances deadline risk and never reruns AI.

Missing sidecars are normal. Invalid sidecars must be ignored by the Viewer without breaking the base report.
