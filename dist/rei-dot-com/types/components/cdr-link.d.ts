export interface CdrLinkTokens {
  /**
   * Border color for the active and pressed states of underlined links
   */
  readonly CdrColorBorderLinkActive: string;
  /**
   * Disabled border color of underlined links
   */
  readonly CdrColorBorderLinkDisabled: string;
  /**
   * Border color for the hover state of underlined links
   */
  readonly CdrColorBorderLinkHover: string;
  /**
   * Border color for underlined links
   */
  readonly CdrColorBorderLinkRest: string;
  /**
   * Border color of visited underlined links
   */
  readonly CdrColorBorderLinkVisited: string;
  /**
   * The icon link color
   */
  readonly CdrColorIconLink: string;
  /**
   * Text color for the active and pressed states of links
   */
  readonly CdrColorTextLinkActive: string;
  /**
   * Disabled text color of links
   */
  readonly CdrColorTextLinkDisabled: string;
  /**
   * Text color for the hover state of links
   */
  readonly CdrColorTextLinkHover: string;
  /**
   * Text color for links
   */
  readonly CdrColorTextLinkRest: string;
  /**
   * Text color of visited links
   */
  readonly CdrColorTextLinkVisited: string;
}

export declare const CdrLink: CdrLinkTokens;

export default CdrLink;
