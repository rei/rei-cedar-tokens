export interface CdrColorIconTokens {
  /**
   * The default icon color
   * @value #4b4a48
   * @cssvar --cdr-color-icon-default
   */
  readonly CdrColorIconDefault: string;
  /**
   * The disabled icon color
   * @value #d5cfc3
   * @cssvar --cdr-color-icon-disabled
   */
  readonly CdrColorIconDisabled: string;
  /**
   * Emphasis or darkest icon color on a light background
   * @value #4b4a48
   * @cssvar --cdr-color-icon-emphasis
   */
  readonly CdrColorIconEmphasis: string;
  /**
   * The icon link color
   * @value #406eb5
   * @cssvar --cdr-color-icon-link
   */
  readonly CdrColorIconLink: string;
}

export declare const CdrColorIcon: CdrColorIconTokens;

export default CdrColorIcon;