/**
 * Shared token metadata utilities for Storybook stories.
 *
 * Builds a runtime lookup map from the dist JSON output so stories can display
 * CSS custom property names and description text alongside token values.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — Vite resolves JSON imports natively; no TS declaration needed
import webJson from '../dist/rei-dot-com/json/web.json';

interface RawTokenEntry {
  name: string;
  docs?: {
    description?: string | { what?: string; when?: string; alternatives?: string[] };
  };
}

/** Convert a CSS-variable kebab name to the JS PascalCase export name.
 *  e.g. cdr-color-text-primary → CdrColorTextPrimary
 *       cdr-duration-1-x       → CdrDuration1X
 */
function toPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function formatDesc(
  d?: string | { what?: string; when?: string; alternatives?: string[] },
): string {
  if (!d) return '';
  if (typeof d === 'string') return d;
  return [d.what, d.when].filter(Boolean).join(' ');
}

const tokenMeta = new Map<string, { cssvar: string; description: string }>();

for (const category of Object.values(webJson as Record<string, RawTokenEntry[]>)) {
  if (!Array.isArray(category)) continue;
  for (const token of category) {
    if (!token.name) continue;
    tokenMeta.set(toPascal(token.name), {
      cssvar: '--' + token.name,
      description: formatDesc(token.docs?.description),
    });
  }
}

/** Get CSS custom property name and description for a JS token name.
 *  Returns empty strings when not found.
 */
export function getMeta(jsName: string): { cssvar: string; description: string } {
  return tokenMeta.get(jsName) ?? { cssvar: '', description: '' };
}

/** Get the CSS custom property name for a JS token name.
 *  e.g. getCssVar('CdrColorTextPrimary') → '--cdr-color-text-primary'
 */
export function getCssVar(jsName: string): string {
  return getMeta(jsName).cssvar;
}

/** Get the usage description for a JS token name. Returns '' if not found. */
export function getDesc(jsName: string): string {
  return getMeta(jsName).description;
}
