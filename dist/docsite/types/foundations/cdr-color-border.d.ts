export interface CdrColorBorderTokens {
  /**
   * Border color for error elements
   * @value #bb4045
   * @cssvar --cdr-color-border-error
   */
  readonly CdrColorBorderError: string;
  /**
   * Border color for informational elements
   * @value #406eb5
   * @cssvar --cdr-color-border-info
   */
  readonly CdrColorBorderInfo: string;
  /**
   * Default border color for separating content
   * @value #d5cfc3
   * @cssvar --cdr-color-border-primary
   */
  readonly CdrColorBorderPrimary: string;
  /**
   * An alternate, secondary background color used on some pages
   * @value #958e83
   * @cssvar --cdr-color-border-secondary
   */
  readonly CdrColorBorderSecondary: string;
  /**
   * Border color for success elements
   * @value #3b8349
   * @cssvar --cdr-color-border-success
   */
  readonly CdrColorBorderSuccess: string;
  /**
   * A transparent color option
   * @value rgba(255, 255, 255, 0)
   * @cssvar --cdr-color-border-transparent
   */
  readonly CdrColorBorderTransparent: string;
  /**
   * Border color for warning elements
   * @value #b68b37
   * @cssvar --cdr-color-border-warning
   */
  readonly CdrColorBorderWarning: string;
}

export declare const CdrColorBorder: CdrColorBorderTokens;

export default CdrColorBorder;