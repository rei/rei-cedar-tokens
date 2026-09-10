// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrLinkTokens {
  /**
   * Border color for the active and pressed states of underlined links
   * @value #0b2d60
   * @cssvar --cdr-color-border-link-active
   */
  readonly CdrColorBorderLinkActive: string;
  /**
   * Disabled border color of underlined links
   * @value #d5cfc3
   * @cssvar --cdr-color-border-link-disabled
   */
  readonly CdrColorBorderLinkDisabled: string;
  /**
   * Border color for the hover state of underlined links
   * @value #406eb5
   * @cssvar --cdr-color-border-link-hover
   */
  readonly CdrColorBorderLinkHover: string;
  /**
   * Border color for underlined links
   * @value #000000
   * @cssvar --cdr-color-border-link-rest
   */
  readonly CdrColorBorderLinkRest: string;
  /**
   * Border color of visited underlined links
   * @value #406eb5
   * @cssvar --cdr-color-border-link-visited
   */
  readonly CdrColorBorderLinkVisited: string;
  /**
   * Text color for the active and pressed states of links
   * @value #4b4a48
   * @cssvar --cdr-color-text-link-active
   */
  readonly CdrColorTextLinkActive: string;
  /**
   * Disabled text color of links
   * @value #d5cfc3
   * @cssvar --cdr-color-text-link-disabled
   */
  readonly CdrColorTextLinkDisabled: string;
  /**
   * Text color for the hover state of links
   * @value rgba(46, 46, 43, 0.9)
   * @cssvar --cdr-color-text-link-hover
   */
  readonly CdrColorTextLinkHover: string;
  /**
   * Text color for links
   * @value rgba(46, 46, 43, 0.9)
   * @cssvar --cdr-color-text-link-rest
   */
  readonly CdrColorTextLinkRest: string;
  /**
   * Text color of visited links
   * @value #406eb5
   * @cssvar --cdr-color-text-link-visited
   */
  readonly CdrColorTextLinkVisited: string;
}

export declare const CdrLink: CdrLinkTokens;
export default CdrLink;