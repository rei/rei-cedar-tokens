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
  CdrColorBackground,
  CdrColorBorder,
  CdrColorText,
  CdrColorIcon,
  CdrMotionDuration,
  CdrMotionTiming,
  CdrBreakpointOrder,
} from '@rei/cdr-tokens';

import type {
  CdrSpaceTokens,
  CdrBreakpointTokens,
  CdrRadiusTokens,
  CdrBreakpointOrderKey,
} from '@rei/cdr-tokens';

// ─── Root "./types" barrel ────────────────────────────────────────────────────
import { CdrBreakpointOrder as CdrBreakpointOrderFromTypes } from '@rei/cdr-tokens/types';
import type { CdrBreakpointOrderKey as CdrBreakpointOrderKeyFromTypes } from '@rei/cdr-tokens/types';

// ─── Value shape assertions ───────────────────────────────────────────────────

// CdrSpace is a plain object — spot-check a known key
const _spaceOneX: string = CdrSpace.CdrSpaceOneX;

// CdrBreakpoint object — known key
const _breakpointLg: string = CdrBreakpoint.CdrBreakpointLg;

// CdrRadius object — known key
const _radiusSoft: string = CdrRadius.CdrRadiusSoft;

// ─── CdrBreakpointOrder contract ─────────────────────────────────────────────

// Must be a readonly tuple, not string[]
const order: ReadonlyArray<CdrBreakpointOrderKey> = CdrBreakpointOrder;

// Root and ./types barrel must export the same underlying type
const _orderFromTypes: ReadonlyArray<CdrBreakpointOrderKeyFromTypes> = CdrBreakpointOrderFromTypes;

// Order must contain exactly the 4 known breakpoints (tuple length check)
const _orderLength: 4 = CdrBreakpointOrder.length;

// Each member must be one of the canonical keys
const _firstKey: 'xs' = CdrBreakpointOrder[0];
const _lastKey: 'lg' = CdrBreakpointOrder[3];

// CdrBreakpointOrderKey must be the union of all members
const _testKey: CdrBreakpointOrderKey = 'sm';
// @ts-expect-error — 'xl' is not a valid breakpoint key
const _badKey: CdrBreakpointOrderKey = 'xl';

// ─── CdrBreakpointOrder is iterable over correct key type ────────────────────
CdrBreakpointOrder.forEach((key: CdrBreakpointOrderKey) => {
  const _val: string =
    CdrBreakpoint[
      `CdrBreakpoint${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof CdrBreakpointTokens
    ];
  void _val;
});

// ─── Type interface shape ─────────────────────────────────────────────────────

// CdrSpaceTokens is an interface — check it can type an object
const _typedSpace: CdrSpaceTokens = CdrSpace;

// CdrBreakpointTokens
const _typedBreakpoint: CdrBreakpointTokens = CdrBreakpoint;

// CdrRadiusTokens
const _typedRadius: CdrRadiusTokens = CdrRadius;

// ─── Suppress unused variable warnings ───────────────────────────────────────
void order;
void _orderFromTypes;
void _breakpointLg;
void _radiusSoft;
void _spaceOneX;
void CdrColorBackground;
void CdrColorBorder;
void CdrColorText;
void CdrColorIcon;
void CdrMotionDuration;
void CdrMotionTiming;
void _testKey;
void _firstKey;
void _lastKey;
void _orderLength;
void _typedSpace;
void _typedBreakpoint;
void _typedRadius;
