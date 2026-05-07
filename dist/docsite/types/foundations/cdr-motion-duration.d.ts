export interface CdrMotionDurationTokens {
  /**
   * @usage Very short animation duration
   * @design Use for micro-interactions
   * @alternatives {duration.2-x}
   * @value 100ms
   * @cssvar --cdr-duration-1-x
   */
  readonly CdrDuration1X: string;
  /**
   * @usage Short animation duration
   * @design Use for quick UI transitions
   * @alternatives {duration.3-x}
   * @value 200ms
   * @cssvar --cdr-duration-2-x
   */
  readonly CdrDuration2X: string;
  /**
   * @usage Medium duration
   * @design Use for standard UI animations
   * @alternatives {duration.4-x}
   * @value 300ms
   * @cssvar --cdr-duration-3-x
   */
  readonly CdrDuration3X: string;
  /**
   * @usage Long duration
   * @design Use for slower transitions
   * @alternatives {duration.5-x}
   * @value 400ms
   * @cssvar --cdr-duration-4-x
   */
  readonly CdrDuration4X: string;
  /**
   * @usage Very long duration
   * @design Use for dramatic or modal transitions
   * @alternatives {duration.6-x}
   * @value 500ms
   * @cssvar --cdr-duration-5-x
   */
  readonly CdrDuration5X: string;
  /**
   * @usage Extra long duration
   * @design Use sparingly for large UI shifts
   * @value 600ms
   * @cssvar --cdr-duration-6-x
   */
  readonly CdrDuration6X: string;
}

export declare const CdrMotionDuration: CdrMotionDurationTokens;

export default CdrMotionDuration;