<script>
  // Overall progress. The host supplies the numbers; the wording, including the
  // accessible description, is presentation and stays here.
  export let percentage = 0;
  export let completed = 0;
  export let total = 0;
  // Elapsed share of the delivery window, when a deadline exists.
  export let timeProgressPercent = null;

  $: ariaLabel = timeProgressPercent === null
    ? `整體進度 ${percentage}%，已完成 ${completed}，共 ${total} 個進度單位`
    : `整體進度 ${percentage}%，已完成 ${completed}，共 ${total} 個進度單位；時間已使用 ${timeProgressPercent}%`;
</script>

<div class="project-progress-label">
  <strong id="project-progress-value">整體約 {percentage}%</strong>
</div>
<progress
  class="project-progress-meter"
  id="project-progress-meter"
  max="100"
  value={percentage}
  aria-label={ariaLabel}
></progress>
