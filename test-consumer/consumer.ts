/**
 * Consumer contract compile test.
 *
 * Simulates a real consumer importing from @rei/cdr-tokens using only root
 * entrypoints. This file must compile clean with `tsc --noEmit` using
 * tsconfig.consumer.json. Any import added here is a permanent contract
 * commitment — do not add experimental or unstable imports.
 *
 * CI: pnpm run test:consumer-types
 */

// ─── Root entrypoint "." ─────────────────────────────────────────────────────
import {
  CdrSpace,
  CdrBreakpoint,
  CdrRadius,
  CdrTextSize,
  CdrColorBackground,
  CdrColorBorder,
  CdrColorText,
  CdrColorIcon,
  CdrMotionDuration,
  CdrMotionTiming,
  CdrBreakpointOrder,
  CdrSpaceScaleOrder,
  CdrTextSizeOrder,
} from '@rei/cdr-tokens';

import type {
  CdrSpaceTokens,
  CdrBreakpointTokens,
  CdrRadiusTokens,
  CdrTextSizeTokens,
  CdrBreakpointOrderKey,
  CdrSpaceScaleOrderKey,
  CdrTextSizeOrderKey,
} from '@rei/cdr-tokens';

// ─── Root "./types" barrel ────────────────────────────────────────────────────
import { CdrBreakpointOrder as CdrBreakpointOrderFromTypes } from '@rei/cdr-tokens/types';
import { CdrBreakpointKeys } from '@rei/cdr-tokens/types/breakpoint.keys';
import {
  CdrSpaceScaleOrder as CdrSpaceScaleOrderFromTypes,
  CdrTextSizeOrder as CdrTextSizeOrderFromTypes,
} from '@rei/cdr-tokens/types';
import { CdrColorBackgroundKeys } from '@rei/cdr-tokens/types/color-background.keys';
import { CdrSpaceKeys } from '@rei/cdr-tokens/types/space.keys';
import type { CdrBreakpointKey } from '@rei/cdr-tokens/types/breakpoint.keys';
import type { CdrColorBackgroundKey } from '@rei/cdr-tokens/types/color-background.keys';
import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space.keys';
import type {
  CdrBreakpointOrderKey as CdrBreakpointOrderKeyFromTypes,
  CdrSpaceScaleOrderKey as CdrSpaceScaleOrderKeyFromTypes,
  CdrTextSizeOrderKey as CdrTextSizeOrderKeyFromTypes,
} from '@rei/cdr-tokens/types';

// ─── Value shape assertions ───────────────────────────────────────────────────

// CdrSpace is a plain object — spot-check a known key
const _spaceOneX: string = CdrSpace.CdrSpaceOneX;

// Token key arrays should be available from per-module key entrypoints
const _breakpointKeys: ReadonlyArray<CdrBreakpointKey> = CdrBreakpointKeys;
const _spaceKeys: ReadonlyArray<CdrSpaceKey> = CdrSpaceKeys;
const _backgroundKeys: ReadonlyArray<CdrColorBackgroundKey> = CdrColorBackgroundKeys;

// CdrBreakpoint object — known key
const _breakpointLg: string = CdrBreakpoint.CdrBreakpointLg;

// CdrRadius object — known key
const _radiusSoft: string = CdrRadius.CdrRadiusSoft;

// ─── CdrBreakpointOrder contract ─────────────────────────────────────────────

// Must be a readonly tuple, not string[]
const order: ReadonlyArray<CdrBreakpointOrderKey> = CdrBreakpointOrder;

// Root and ./types barrel must export the same underlying type
const _orderFromTypes: ReadonlyArray<CdrBreakpointOrderKeyFromTypes> = CdrBreakpointOrderFromTypes;

const _spaceScaleOrderFromTypes: ReadonlyArray<CdrSpaceScaleOrderKeyFromTypes> =
  CdrSpaceScaleOrderFromTypes;

const _textSizeOrderFromTypes: ReadonlyArray<CdrTextSizeOrderKeyFromTypes> =
  CdrTextSizeOrderFromTypes;

// Order must contain exactly the 4 known breakpoints (tuple length check)
const _orderLength: 4 = CdrBreakpointOrder.length;

// Each member must be one of the canonical keys
const _firstKey: 'xs' = CdrBreakpointOrder[0];
const _lastKey: 'lg' = CdrBreakpointOrder[3];

// CdrBreakpointOrderKey must be the union of all members
const _testKey: CdrBreakpointOrderKey = 'sm';
// @ts-expect-error — 'xl' is not a valid breakpoint key
const _badKey: CdrBreakpointOrderKey = 'xl';

// Space scale order key union
const _spaceScaleKey: CdrSpaceScaleOrderKey = '4';
// @ts-expect-error — '9' is not a valid space scale key
const _badSpaceScaleKey: CdrSpaceScaleOrderKey = '9';

// Text size order key union
const _textSizeKey: CdrTextSizeOrderKey = 'cdr-text-heading-display1600-size';
// @ts-expect-error — invalid text size key
const _badTextSizeKey: CdrTextSizeOrderKey = 'cdr-text-heading-display1700-size';

// ─── CdrBreakpointOrder is iterable over correct key type ────────────────────
CdrBreakpointOrder.forEach((key: CdrBreakpointOrderKey) => {
  const _val: string =
    CdrBreakpoint[
      `CdrBreakpoint${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof CdrBreakpointTokens
    ];
  void _val;
});

// ─── Additional order arrays are iterable over correct key types ─────────────
CdrSpaceScaleOrder.forEach((key: CdrSpaceScaleOrderKey) => {
  const _k: CdrSpaceScaleOrderKey = key;
  void _k;
});

CdrTextSizeOrder.forEach((key: CdrTextSizeOrderKey) => {
  const _k: CdrTextSizeOrderKey = key;
  void _k;
});

// ─── Type interface shape ─────────────────────────────────────────────────────

// CdrSpaceTokens is an interface — check it can type an object
const _typedSpace: CdrSpaceTokens = CdrSpace;

// CdrBreakpointTokens
const _typedBreakpoint: CdrBreakpointTokens = CdrBreakpoint;

// CdrRadiusTokens
const _typedRadius: CdrRadiusTokens = CdrRadius;

// CdrTextSizeTokens
const _typedTextSize: CdrTextSizeTokens = CdrTextSize;

// ─── Suppress unused variable warnings ───────────────────────────────────────
void order;
void _orderFromTypes;
void _spaceScaleOrderFromTypes;
void _textSizeOrderFromTypes;
void _breakpointLg;
void _radiusSoft;
void _spaceOneX;
void _breakpointKeys;
void _spaceKeys;
void _backgroundKeys;
void CdrColorBackground;
void CdrColorBorder;
void CdrColorText;
void CdrColorIcon;
void CdrMotionDuration;
void CdrMotionTiming;
void _testKey;
void _spaceScaleKey;
void _textSizeKey;
void _firstKey;
void _lastKey;
void _orderLength;
void _typedSpace;
void _typedBreakpoint;
void _typedRadius;
void _typedTextSize;
