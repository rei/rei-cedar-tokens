/**
 * Canonical breakpoint order from smallest to largest.
 * Use this instead of hardcoding token order in consumer code.
 *
 * @example
 * import { CdrBreakpointOrder } from '@rei/cdr-tokens';
 * CdrBreakpointOrder.forEach((bp) => applyBreakpointStyles(bp));
 */
export const CdrBreakpointOrder = ["xs","sm","md","lg"];
