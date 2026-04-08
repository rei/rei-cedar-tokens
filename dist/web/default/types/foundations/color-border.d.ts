export interface ColorBorderTokens {
  /**
   * Border color for error elements
   */
  readonly CdrColorBorderError: string;
  /**
   * Border color for informational elements
   */
  readonly CdrColorBorderInfo: string;
  /**
   * Default border color for separating content
   */
  readonly CdrColorBorderPrimary: string;
  /**
   * An alternate, secondary background color used on some pages
   */
  readonly CdrColorBorderSecondary: string;
  /**
   * Border color for success elements
   */
  readonly CdrColorBorderSuccess: string;
  /**
   * A transparent color option
   */
  readonly CdrColorBorderTransparent: string;
  /**
   * Border color for warning elements
   */
  readonly CdrColorBorderWarning: string;
}

export declare const ColorBorder: ColorBorderTokens;

export default ColorBorder;
