/**
 * Canonical breakpoint order from smallest to largest.
 * Use this instead of hardcoding breakpoint order in consumer code.
 *
 * @example
 * import { CdrBreakpointOrder } from '@rei/cdr-tokens';
 * CdrBreakpointOrder.forEach((bp) => applyBreakpointStyles(bp));
 */
export const CdrBreakpointOrder = ["xs","sm","md","lg"] as const;
export type CdrBreakpointOrderKey = (typeof CdrBreakpointOrder)[number];
