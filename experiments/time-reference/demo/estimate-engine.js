const registeredEstimateAlgorithms = Object.freeze({
  "direct-human-estimate": (inputs, humanNote) => {
    const likelyHours = inputs.likely_hours;
    return {
      lowHours: likelyHours * (2 / 3),
      likelyHours,
      highHours: likelyHours * 2,
      explanation: `${likelyHours} hr × 60 = ${Math.round(likelyHours * 60)} min。`,
      rationale: humanNote || "人工直接提供最可能工時。",
    };
  },
  "engineering-decomposition": (inputs, humanNote) => {
    const baseHours = inputs.base_implementation_hours;
    const routeCount = inputs.exploration_routes;
    const likelyHours = baseHours + routeCount * 4;
    return {
      lowHours: baseHours * (2 / 3) + routeCount * (4 / 3),
      likelyHours,
      highHours: baseHours * 2 + routeCount * 8,
      explanation: `${baseHours} hr + ${routeCount} × 4 hr = ${likelyHours} hr。`,
      rationale: `${humanNote || "人工提供工程參數。"}；AI 選擇工程拆解方法，再由固定公式重新計算；最後結果尚未人工確認。`,
    };
  },
  "default-workday": (inputs) => {
    const likelyHours = inputs.default_item_hours;
    return {
      likelyHours,
      explanation: `${likelyHours} hr × 60 = ${Math.round(likelyHours * 60)} min。`,
      rationale: "尚無工程計畫，套用預設一日；未虛構低值與高值。",
    };
  },
});

function calculateRegisteredEstimate(algorithmId, inputs, humanNote = "") {
  const algorithm = registeredEstimateAlgorithms[algorithmId];
  if (!algorithm) throw new Error(`尚未登錄估算算法：${algorithmId ?? "未指定"}`);
  if (Object.values(inputs).some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error("人工參數必須是大於零的有效數值。");
  }
  return algorithm(inputs, humanNote);
}

globalThis.TimeEstimateEngine = Object.freeze({
  algorithmIds: Object.freeze(Object.keys(registeredEstimateAlgorithms)),
  calculate: calculateRegisteredEstimate,
});
