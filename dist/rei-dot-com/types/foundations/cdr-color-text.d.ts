export interface CdrColorTextTokens {
  /**
   * Text set in our primary brand color
   */
  readonly CdrColorTextBrand: string;
  /**
   * The color of text when it is disabled
   */
  readonly CdrColorTextDisabled: string;
  /**
   * The emphasis text color
   */
  readonly CdrColorTextEmphasis: string;
  /**
   * Color of error messages
   */
  readonly CdrColorTextError: string;
  /**
   * Color of informational messages
   */
  readonly CdrColorTextInfo: string;
  /**
   * Text color on dark background
   */
  readonly CdrColorTextInverse: string;
  /**
   * The default, primary text color
   */
  readonly CdrColorTextPrimary: string;
  /**
   * The color of sale text
   */
  readonly CdrColorTextSale: string;
  /**
   * The secondary text color
   */
  readonly CdrColorTextSecondary: string;
  /**
   * Color of success messages
   */
  readonly CdrColorTextSuccess: string;
  /**
   * Color of warning messages
   */
  readonly CdrColorTextWarning: string;
}

export declare const CdrColorText: CdrColorTextTokens;

export default CdrColorText;
