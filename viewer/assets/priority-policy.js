(function initializeTaskProgressPriorityPolicy(global) {
  const minimum = 0;
  const maximum = 4;
  const fallbackValue = 4;
  const creationDefaultValue = 4;
  const defaultLevels = [
    { value: 0, label: "立即", tone: "urgent" },
    { value: 1, label: "優先", tone: "important" },
    { value: 2, label: "一般", tone: "normal" },
    { value: 3, label: "次要", tone: "secondary" },
    { value: 4, label: "未指定", tone: "unspecified", hidden: true },
  ];

  function createPolicy(levelDefinitions) {
    const candidates = new Map();
    let labelsValid = Array.isArray(levelDefinitions)
      && levelDefinitions.length === maximum - minimum + 1;
    (Array.isArray(levelDefinitions) ? levelDefinitions : []).forEach((level) => {
      const value = level?.value;
      if (
        !Number.isInteger(value)
        || value < minimum
        || value > maximum
        || candidates.has(value)
      ) {
        labelsValid = false;
        return;
      }
      candidates.set(value, level);
    });

    const seenLabels = new Set();
    const levels = Object.freeze(
      Array.from({ length: maximum - minimum + 1 }, (_, index) => {
        const value = minimum + index;
        const candidate = candidates.get(value);
        const label = typeof candidate?.label === "string"
          ? candidate.label.trim()
          : "";
        if (!label) labelsValid = false;
        if (seenLabels.has(label)) labelsValid = false;
        if (label) seenLabels.add(label);
        return Object.freeze({
          value,
          label,
          tone: typeof candidate?.tone === "string" && candidate.tone.trim()
            ? candidate.tone.trim()
            : "normal",
          hidden: candidate?.hidden === true,
        });
      }),
    );
    const byValue = Object.freeze(
      Object.fromEntries(levels.map((level) => [level.value, level])),
    );

    function normalize(value, fallback = fallbackValue) {
      const candidate = typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : value;
      return Number.isInteger(candidate) && candidate >= minimum && candidate <= maximum
        ? candidate
        : fallback;
    }

    function metadata(value, fallback = fallbackValue) {
      return byValue[normalize(value, fallback)] ?? null;
    }

    function format(value, fallback = fallbackValue) {
      const level = metadata(value, fallback);
      if (!level) return "";
      return labelsValid ? level.label : `P${level.value}`;
    }

    return Object.freeze({
      levels,
      minimum,
      maximum,
      fallbackValue,
      creationDefaultValue,
      labelsValid,
      normalize,
      metadata,
      format,
      create: createPolicy,
    });
  }

  global.TaskProgressPriorityPolicy = createPolicy(defaultLevels);
}(globalThis));
