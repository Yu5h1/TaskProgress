// Exercise the product's template functions without a browser or a compiler.
// This is a template-value probe, not a DOM/interaction or Lit renderer substitute.
import { readFile } from 'node:fs/promises';

const nothing = Symbol('nothing');
const html = (strings, ...values) => ({ strings, values });
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export function markup(value) {
  if (value == null || value === nothing || typeof value === 'function') return '';
  if (Array.isArray(value)) return value.map(markup).join('');
  if (value?.strings) return value.strings.reduce((out, part, index) => {
    const next = value.values[index];
    const text = markup(next);
    return out + part + (index < value.values.length && part.endsWith('=') ? `"${text}"` : text);
  }, '');
  if (typeof value === 'object') return '';
  return escape(value);
}

export function handlers(template, event) {
  if (Array.isArray(template)) return template.flatMap(value => handlers(value, event));
  if (!template?.strings) return [];
  return template.values.flatMap((value, index) => {
    if (typeof value === 'function' && template.strings[index].endsWith(`@${event}=`)) {
      return [{ before: template.strings.slice(0, index + 1).join(''), after: template.strings[index + 1], callback: value }];
    }
    return handlers(value, event);
  });
}

const cache = new Map();
export async function loadTemplates(name) {
  if (cache.has(name)) return cache.get(name);
  const pending = load(name);
  cache.set(name, pending);
  return pending;
}
async function load(name) {
  let source = await readFile(new URL(`../../ui/web-workflow/${name}.mjs`, import.meta.url), 'utf8');
  const imports = [...source.matchAll(/^import \{([^}]+)\} from ['"]([^'"]+)['"];$/gm)];
  const bindings = {};
  for (const [, names, specifier] of imports) {
    let module;
    if (specifier === 'lit') module = { html, svg: html, nothing, render() {} };
    else if (specifier === 'lit/directives/repeat.js') module = { repeat: (items, key, render) => items.map(render) };
    else if (specifier === 'lit/directives/guard.js') module = { guard: (_, render) => render() };
    else if (specifier === 'lit/directives/live.js') module = { live: value => value };
    else if (specifier === 'lit/directive.js') module = { directive: () => (_, value) => value?.text ?? nothing };
    else if (specifier === 'lit/async-directive.js') module = { AsyncDirective: class {} };
    else if (specifier === '@web/ui') module = { registerUi() {}, bindLongPress() {}, bindChoicePicker() {}, bindReorder() {} };
    else if (specifier === './bootstrap.mjs') module = { createBackLink() {}, bootstrap() {} };
    else if (specifier.startsWith('@taskprogress/')) module = await import(new URL(`../../viewer/assets/${specifier.slice(14)}`, import.meta.url));
    else if (specifier.startsWith('./')) module = await loadTemplates(specifier.slice(2, -4));
    else throw new Error(`Unmapped template dependency: ${specifier}`);
    for (const declaration of names.split(',')) {
      const [original, alias = original] = declaration.trim().split(/\s+as\s+/u);
      if (!(original in module)) throw new Error(`Missing ${original} in ${specifier}`);
      bindings[alias] = module[original];
    }
  }
  source = source.replace(/^import .*;\r?$/gm, '').replace(/^export \{.*\};\r?$/gm, '');
  const exports = [...source.matchAll(/^export (?:const|function|class) (\w+)/gm)].map(match => match[1]);
  // Private template entry points let the tests inspect the actual row/card branches.
  if (name === 'viewer') exports.push('taskCard', 'itemRow', 'developer', 'pointer', 'templates');
  if (name === 'checklist') {
    // Keep the real class and its imported controllers, omitting browser startup.
    source = source.slice(source.indexOf('const TAGS ='), source.indexOf('const app = new Checklist'));
    exports.push('Checklist');
  }
  source = source.replace(/^export /gm, '');
  bindings.registerUiAdapter = () => {};
  const result = new Function(...Object.keys(bindings), `${source}\nreturn { ${exports.join(', ')} };`)(...Object.values(bindings));
  if (name === 'common') Object.assign(result, { html, nothing, repeat: bindings.repeat, live: bindings.live });
  return result;
}

export const view = () => ({ state: {}, props: {}, target: {}, draw() {} });
