export interface CdrRadiusTokens {
  /**
   * @usage Fully circular radius
   * @design Use for circular elements
   * @value 9999
   * @cssvar --cdr-radius-round
   */
  readonly CdrRadiusRound: string;
  /**
   * @usage Zero-radius corner
   * @design Use for crisp, squared edges
   * @alternatives {radius.soft}
   * @value 0
   * @cssvar --cdr-radius-sharp
   */
  readonly CdrRadiusSharp: string;
  /**
   * @usage Small, subtle corner radius
   * @design Use for gentle rounding
   * @alternatives {radius.softer}
   * @value 2
   * @cssvar --cdr-radius-soft
   */
  readonly CdrRadiusSoft: string;
  /**
   * @usage Medium corner radius
   * @design Use for more noticeable rounding
   * @alternatives {radius.softest}
   * @value 4
   * @cssvar --cdr-radius-softer
   */
  readonly CdrRadiusSofter: string;
  /**
   * @usage Large rounded corner
   * @design Use for pill-like shapes
   * @alternatives {radius.softest}
   * @value 6
   * @cssvar --cdr-radius-softest
   */
  readonly CdrRadiusSoftest: string;
}

export declare const CdrRadius: CdrRadiusTokens;

export default CdrRadius;