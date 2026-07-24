import assert from "node:assert/strict";
import test from "node:test";
import {
  CUSTOM_COLOR_FIELDS,
  DEFAULT_CUSTOM_PALETTES,
  THEME_STORAGE_KEY,
  applyThemePreference,
  contrastRatio,
  createCustomPalette,
  getContrastWarnings,
  loadThemePreference,
  normalizeThemePreference,
  preferenceWithMode,
  resolveSystemScheme,
  saveThemePreference,
} from "../viewer/assets/theme-model.js";

function createStorage(initialValue = null) {
  const values = new Map();
  if (initialValue !== null) values.set(THEME_STORAGE_KEY, initialValue);
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
}

function createRoot() {
  const properties = new Map();
  return {
    dataset: {},
    style: {
      colorScheme: "",
      setProperty(key, value) { properties.set(key, value); },
      removeProperty(key) { properties.delete(key); },
    },
    properties,
  };
}

test("invalid or unavailable settings fall back to system mode", () => {
  assert.deepEqual(normalizeThemePreference(null), { version: 1, mode: "system" });
  assert.deepEqual(normalizeThemePreference({ version: 2, mode: "dark" }), { version: 1, mode: "system" });
  assert.deepEqual(loadThemePreference(createStorage("not json")), { version: 1, mode: "system" });
});

test("custom palettes accept only complete hexadecimal colors", () => {
  const palette = createCustomPalette("dark", {
    heading: "#ABCDEF",
    itemText: "red",
  });
  assert.equal(palette.base, "dark");
  assert.equal(palette.heading, "#abcdef");
  assert.equal(palette.itemText, DEFAULT_CUSTOM_PALETTES.dark.itemText);
  assert.equal(Object.keys(palette).length, CUSTOM_COLOR_FIELDS.length + 1);
});

test("the default dark palette stays Obsidian-style blue-gray", () => {
  assert.deepEqual(DEFAULT_CUSTOM_PALETTES.dark, {
    pageBackground: "#171a21",
    panelBackground: "#202530",
    heading: "#eef2f7",
    panelHeading: "#dfe6ef",
    itemText: "#cbd4df",
    secondaryText: "#9da9b8",
    border: "#343c49",
    accent: "#7f9fd1",
  });
});

test("theme storage preserves a custom palette while switching modes", () => {
  const storage = createStorage();
  const custom = createCustomPalette("dark", { accent: "#12ab34" });
  const saved = saveThemePreference(storage, { version: 1, mode: "custom", custom });
  const dark = preferenceWithMode(saved, "dark");
  saveThemePreference(storage, dark);
  const loaded = loadThemePreference(storage);
  assert.equal(loaded.mode, "dark");
  assert.equal(loaded.custom.accent, "#12ab34");
  assert.equal(preferenceWithMode(loaded, "custom").custom.accent, "#12ab34");
});

test("applying themes removes stale custom variables", () => {
  const root = createRoot();
  const custom = createCustomPalette("dark", { heading: "#ffffff" });
  applyThemePreference(root, { version: 1, mode: "custom", custom });
  assert.equal(root.dataset.theme, "custom");
  assert.equal(root.dataset.themeBase, "dark");
  assert.equal(root.properties.get("--color-heading"), "#ffffff");
  assert.equal(root.style.colorScheme, "dark");

  applyThemePreference(root, { version: 1, mode: "system", custom });
  assert.equal(root.dataset.theme, "system");
  assert.equal(root.dataset.themeBase, undefined);
  assert.equal(root.properties.size, 0);
  assert.equal(root.style.colorScheme, "light dark");
});

test("system scheme resolution follows the browser media preference", () => {
  assert.equal(resolveSystemScheme(() => ({ matches: true })), "dark");
  assert.equal(resolveSystemScheme(() => ({ matches: false })), "light");
  assert.equal(resolveSystemScheme(() => { throw new Error("unavailable"); }), "light");
});

test("default palettes meet normal-text contrast while low contrast is reported", () => {
  for (const palette of Object.values(DEFAULT_CUSTOM_PALETTES)) {
    assert.deepEqual(getContrastWarnings(palette), []);
  }
  assert.ok(contrastRatio("#17211d", "#f5f3ec") >= 4.5);
  assert.ok(getContrastWarnings(createCustomPalette("light", {
    heading: "#eeeeee",
    panelHeading: "#eeeeee",
    itemText: "#eeeeee",
    secondaryText: "#eeeeee",
  })).length >= 4);
});
