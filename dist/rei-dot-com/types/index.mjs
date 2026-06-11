/**
 * Cedar Semantic Contract
 *
 * This module exports semantic foundation tokens with version stability guarantees.
 * Consumers can depend on these exports not changing name or being removed within a major version.
 *
 * Use for framework integrations (Tailwind, styled-components, etc).
 * Consumers own mapping these values to their framework.
 */

export { CdrBreakpoint } from './foundations/cdr-breakpoint.mjs';
export { CdrColorBackground } from './foundations/cdr-color-background.mjs';
export { CdrColorBorder } from './foundations/cdr-color-border.mjs';
export { CdrColorIcon } from './foundations/cdr-color-icon.mjs';
export { CdrColorText } from './foundations/cdr-color-text.mjs';
export { CdrFont } from './foundations/cdr-font.mjs';
export { CdrLineHeight } from './foundations/cdr-line-height.mjs';
export { CdrMotionDuration } from './foundations/cdr-motion-duration.mjs';
export { CdrMotionTiming } from './foundations/cdr-motion-timing.mjs';
export { CdrProminence } from './foundations/cdr-prominence.mjs';
export { CdrRadius } from './foundations/cdr-radius.mjs';
export { CdrSpace } from './foundations/cdr-space.mjs';
export { CdrSpaceIcon } from './foundations/cdr-space-icon.mjs';
export { CdrSpaceInset } from './foundations/cdr-space-inset.mjs';
export { CdrSpaceScale } from './foundations/cdr-space-scale.mjs';
export { CdrTextFamily } from './foundations/cdr-text-family.mjs';
export { CdrTextSize } from './foundations/cdr-text-size.mjs';
export { CdrTextStyle } from './foundations/cdr-text-style.mjs';
export { CdrTextWeight } from './foundations/cdr-text-weight.mjs';
export { CdrTextLetterSpacing } from './foundations/cdr-text-letter-spacing.mjs';
export { CdrTextLineHeight } from './foundations/cdr-text-line-height.mjs';
export { CdrType } from './foundations/cdr-type.mjs';
export { CdrBreakpointOrder } from './foundations/cdr-breakpoint-order.mjs';
export { CdrSpaceScaleOrder } from './foundations/cdr-space-scale-order.mjs';
export { CdrTextSizeOrder } from './foundations/cdr-text-size-order.mjs';

// Deprecated v13 backward-compat: flat token values
export * from './_compat-deprecated.mjs';
