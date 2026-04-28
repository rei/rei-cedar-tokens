export interface CdrTabTokens {
  /**
   * Border color for the active tab keyline
   */
  readonly CdrColorBorderTabKeylineActive: string;
  /**
   * Alternative border color for the active tab keyline
   */
  readonly CdrColorBorderTabKeylineActiveAlt: string;
  /**
   * Border color for the disabled tab keyline
   */
  readonly CdrColorBorderTabKeylineDisabled: string;
  /**
   * Border color for the tab keyline hover state
   */
  readonly CdrColorBorderTabKeylineHover: string;
  /**
   * Alternative border color for the tab keyline hover state
   */
  readonly CdrColorBorderTabKeylineHoverAlt: string;
  /**
   * The border color of tab keyline
   */
  readonly CdrColorBorderTabKeylineRest: string;
  /**
   * Text color for the active and pressed states of tabs
   */
  readonly CdrColorTextTabActive: string;
  /**
   * Disabled text color of tabs
   */
  readonly CdrColorTextTabDisabled: string;
  /**
   * Text color for the hover state of tabs
   */
  readonly CdrColorTextTabHover: string;
  /**
   * Text color for tabs
   */
  readonly CdrColorTextTabRest: string;
}

export declare const CdrTab: CdrTabTokens;

export default CdrTab;