/**
 * Canonical space scale order from smallest to largest.
 * Use this instead of hardcoding token order in consumer code.
 *
 * @example
 * import { CdrSpaceScaleOrder } from '@rei/cdr-tokens';
 * CdrSpaceScaleOrder.forEach((step) => applySpaceStep(step));
 */
export const CdrSpaceScaleOrder = ["0","1","2","3","4","5","6","7","8","range3-to4"];
