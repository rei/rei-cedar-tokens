/**
 * Canonical space scale order from smallest to largest.
 * Use this instead of hardcoding token order in consumer code.
 *
 * @example
 * import { CdrSpaceScaleOrder } from '@rei/cdr-tokens';
 * CdrSpaceScaleOrder.forEach((step) => applySpaceStep(step));
 */
export const CdrSpaceScaleOrder = ["0","01","1","2","3","34","35","4","5","6","7","8"];
