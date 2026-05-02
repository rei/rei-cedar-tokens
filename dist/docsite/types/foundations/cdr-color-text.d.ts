export interface CdrColorTextTokens {
  /**
   * Text set in our primary brand color
   * @value #1f513f
   * @cssvar --cdr-color-text-brand
   */
  readonly CdrColorTextBrand: string;
  /**
   * The color of text when it is disabled
   * @value #d5cfc3
   * @cssvar --cdr-color-text-disabled
   */
  readonly CdrColorTextDisabled: string;
  /**
   * The emphasis text color
   * @value #2e2e2b
   * @cssvar --cdr-color-text-emphasis
   */
  readonly CdrColorTextEmphasis: string;
  /**
   * Color of error messages
   * @value #811823
   * @cssvar --cdr-color-text-error
   */
  readonly CdrColorTextError: string;
  /**
   * Color of informational messages
   * @value #1b437e
   * @cssvar --cdr-color-text-info
   */
  readonly CdrColorTextInfo: string;
  /**
   * Text color on dark background
   * @value #fafbf9
   * @cssvar --cdr-color-text-inverse
   */
  readonly CdrColorTextInverse: string;
  /**
   * The default, primary text color
   * @value rgba(46, 46, 43, 0.9)
   * @cssvar --cdr-color-text-primary
   */
  readonly CdrColorTextPrimary: string;
  /**
   * The color of sale text
   * @value #c7370f
   * @cssvar --cdr-color-text-sale
   */
  readonly CdrColorTextSale: string;
  /**
   * The secondary text color
   * @value #4b4a48
   * @cssvar --cdr-color-text-secondary
   */
  readonly CdrColorTextSecondary: string;
  /**
   * Color of success messages
   * @value #2e6b34
   * @cssvar --cdr-color-text-success
   */
  readonly CdrColorTextSuccess: string;
  /**
   * Color of warning messages
   * @value #854714
   * @cssvar --cdr-color-text-warning
   */
  readonly CdrColorTextWarning: string;
}

export declare const CdrColorText: CdrColorTextTokens;

export default CdrColorText;