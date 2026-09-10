// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrTabTokens {
  /**
   * Border color for the active tab keyline
   * @value #406eb5
   * @cssvar --cdr-color-border-tab-keyline-active
   */
  readonly CdrColorBorderTabKeylineActive: string;
  /**
   * Alternative border color for the active tab keyline
   * @value #78b1e8
   * @cssvar --cdr-color-border-tab-keyline-active-alt
   */
  readonly CdrColorBorderTabKeylineActiveAlt: string;
  /**
   * Border color for the disabled tab keyline
   * @value #d5cfc3
   * @cssvar --cdr-color-border-tab-keyline-disabled
   */
  readonly CdrColorBorderTabKeylineDisabled: string;
  /**
   * Border color for the tab keyline hover state
   * @value #406eb5
   * @cssvar --cdr-color-border-tab-keyline-hover
   */
  readonly CdrColorBorderTabKeylineHover: string;
  /**
   * Alternative border color for the tab keyline hover state
   * @value #78b1e8
   * @cssvar --cdr-color-border-tab-keyline-hover-alt
   */
  readonly CdrColorBorderTabKeylineHoverAlt: string;
  /**
   * The border color of tab keyline
   * @value #958e83
   * @cssvar --cdr-color-border-tab-keyline-rest
   */
  readonly CdrColorBorderTabKeylineRest: string;
  /**
   * Text color for the active and pressed states of tabs
   * @value #4b4a48
   * @cssvar --cdr-color-text-tab-active
   */
  readonly CdrColorTextTabActive: string;
  /**
   * Disabled text color of tabs
   * @value #d5cfc3
   * @cssvar --cdr-color-text-tab-disabled
   */
  readonly CdrColorTextTabDisabled: string;
  /**
   * Text color for the hover state of tabs
   * @value #406eb5
   * @cssvar --cdr-color-text-tab-hover
   */
  readonly CdrColorTextTabHover: string;
  /**
   * Text color for tabs
   * @value #736e65
   * @cssvar --cdr-color-text-tab-rest
   */
  readonly CdrColorTextTabRest: string;
}

export declare const CdrTab: CdrTabTokens;
export default CdrTab;