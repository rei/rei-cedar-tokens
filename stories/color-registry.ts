// Resolver for tokens/compatibility-registry.json.
// Maps canonical paths like "color/feedback/surface/error/faint" to the
// compiled flat token keys (e.g. CdrColorFeedbackSurfaceErrorFaint).

import registry from '../tokens/compatibility-registry.json';
import { CdrColorAction } from '../dist/rei-dot-com/types/foundations/cdr-color-action.mjs';
import { CdrColorControl } from '../dist/rei-dot-com/types/foundations/cdr-color-control.mjs';
import { CdrColorFeedback } from '../dist/rei-dot-com/types/foundations/cdr-color-feedback.mjs';
import { CdrColorSelection } from '../dist/rei-dot-com/types/foundations/cdr-color-selection.mjs';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import { CdrColorText } from '../dist/rei-dot-com/types/foundations/cdr-color-text.mjs';
import { CdrColorIcon } from '../dist/rei-dot-com/types/foundations/cdr-color-icon.mjs';
import { CdrColorGraphik } from '../dist/rei-dot-com/types/foundations/cdr-color-graphik.mjs';

const MODULES: Record<string, Record<string, string>> = {
  action: CdrColorAction,
  control: CdrColorControl,
  feedback: CdrColorFeedback,
  selection: CdrColorSelection,
  surface: CdrColorSurface,
  text: CdrColorText,
  icon: CdrColorIcon,
  // NB: the compiled export is CdrColorGraphik but its keys are CdrColorGraphic*
  graphic: CdrColorGraphik,
};

const pascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function tokenKeyForPath(path: string): string {
  const segments = path.split('/');
  const [, family, ...rest] = segments;
  return `CdrColor${pascal(family)}${rest.map(pascal).join('')}`;
}

export function resolvePath(path: string): string {
  const segments = path.split('/');
  const [, family] = segments;
  const key = tokenKeyForPath(path);
  const mod = MODULES[family];
  const value = mod?.[key];
  if (value === undefined) {
    throw new Error(`compatibility-registry path "${path}" resolved to missing token "${key}"`);
  }
  return value;
}

export type RegistryCombination = {
  surface: string;
  content: string;
  border: string | null;
  states: string[];
  nonColorCue: string;
  notes: string;
};

export const combinations = registry.combinations as Record<string, RegistryCombination>;
