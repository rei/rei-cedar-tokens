export interface CdrBreakpointTokens {
  /**
   * @usage Fully circular radius
   * @design Use for circular elements
   */
  readonly CdrRadiusRound: string;
  /**
   * @usage Zero-radius corner
   * @design Use for crisp, squared edges
   * @alternatives {radius.soft}
   */
  readonly CdrRadiusSharp: string;
  /**
   * @usage Small, subtle corner radius
   * @design Use for gentle rounding
   * @alternatives {radius.softer}
   */
  readonly CdrRadiusSoft: string;
  /**
   * @usage Medium corner radius
   * @design Use for more noticeable rounding
   * @alternatives {radius.softest}
   */
  readonly CdrRadiusSofter: string;
  /**
   * @usage Large rounded corner
   * @design Use for pill-like shapes
   * @alternatives {radius.softest}
   */
  readonly CdrRadiusSoftest: string;
}

export declare const CdrBreakpoint: CdrBreakpointTokens;

export default CdrBreakpoint;
