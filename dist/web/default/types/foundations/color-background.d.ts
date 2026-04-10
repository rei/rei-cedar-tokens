export interface ColorBackgroundTokens {
  /**
   * An alternate, spruce brand background color used on some pages
   */
  readonly CdrColorBackgroundBrandSpruce: string;
  /**
   * Background color for error messages
   */
  readonly CdrColorBackgroundError: string;
  /**
   * Background color for informational messages
   */
  readonly CdrColorBackgroundInfo: string;
  /**
   * The default, primary background color of most pages
   */
  readonly CdrColorBackgroundPrimary: string;
  /**
   * Background color for sale messages
   */
  readonly CdrColorBackgroundSale: string;
  /**
   * An alternate, secondary background color used on some pages
   */
  readonly CdrColorBackgroundSecondary: string;
  /**
   * Background color for success messages
   */
  readonly CdrColorBackgroundSuccess: string;
  /**
   * A transparent color option
   */
  readonly CdrColorBackgroundTransparent: string;
  /**
   * Background color for warning messages
   */
  readonly CdrColorBackgroundWarning: string;
}

export declare const ColorBackground: ColorBackgroundTokens;

export default ColorBackground;
