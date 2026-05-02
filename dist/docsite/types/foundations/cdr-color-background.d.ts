export interface CdrColorBackgroundTokens {
  /**
   * An alternate, spruce brand background color used on some pages
   * @value #1f513f
   * @cssvar --cdr-color-background-brand-spruce
   */
  readonly CdrColorBackgroundBrandSpruce: string;
  /**
   * Background color for error messages
   * @value #fcefe4
   * @cssvar --cdr-color-background-error
   */
  readonly CdrColorBackgroundError: string;
  /**
   * Background color for informational messages
   * @value #e2f4fe
   * @cssvar --cdr-color-background-info
   */
  readonly CdrColorBackgroundInfo: string;
  /**
   * The default, primary background color of most pages
   * @value #f7f5f3
   * @cssvar --cdr-color-background-primary
   */
  readonly CdrColorBackgroundPrimary: string;
  /**
   * Background color for sale messages
   * @value #c7370f
   * @cssvar --cdr-color-background-sale
   */
  readonly CdrColorBackgroundSale: string;
  /**
   * An alternate, secondary background color used on some pages
   * @value #ffffff
   * @cssvar --cdr-color-background-secondary
   */
  readonly CdrColorBackgroundSecondary: string;
  /**
   * Background color for success messages
   * @value #ecf9e6
   * @cssvar --cdr-color-background-success
   */
  readonly CdrColorBackgroundSuccess: string;
  /**
   * A transparent color option
   * @value rgba(255, 255, 255, 0)
   * @cssvar --cdr-color-background-transparent
   */
  readonly CdrColorBackgroundTransparent: string;
  /**
   * Background color for warning messages
   * @value #fdf6e2
   * @cssvar --cdr-color-background-warning
   */
  readonly CdrColorBackgroundWarning: string;
}

export declare const CdrColorBackground: CdrColorBackgroundTokens;

export default CdrColorBackground;