// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrTooltipTokens {
  /**
   * Background color for tooltips
   * @value #2e2e2b
   * @cssvar --cdr-color-background-tooltip-default
   */
  readonly CdrColorBackgroundTooltipDefault: string;
  /**
   * Border color for tooltips
   * @value #fafbf9
   * @cssvar --cdr-color-border-tooltip-default
   */
  readonly CdrColorBorderTooltipDefault: string;
  /**
   * Text color for tooltips
   * @value #fafbf9
   * @cssvar --cdr-color-text-tooltip-default
   */
  readonly CdrColorTextTooltipDefault: string;
}

export declare const CdrTooltip: CdrTooltipTokens;
export default CdrTooltip;