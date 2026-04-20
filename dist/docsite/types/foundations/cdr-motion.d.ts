export interface CdrMotionTokens {
  /**
   * @usage Very short animation duration
   * @design Use for micro-interactions
   * @alternatives {duration.2-x}
   */
  readonly CdrDuration1X: string;
  /**
   * @usage Short animation duration
   * @design Use for quick UI transitions
   * @alternatives {duration.3-x}
   */
  readonly CdrDuration2X: string;
  /**
   * @usage Medium duration
   * @design Use for standard UI animations
   * @alternatives {duration.4-x}
   */
  readonly CdrDuration3X: string;
  /**
   * @usage Long duration
   * @design Use for slower transitions
   * @alternatives {duration.5-x}
   */
  readonly CdrDuration4X: string;
  /**
   * @usage Very long duration
   * @design Use for dramatic or modal transitions
   * @alternatives {duration.6-x}
   */
  readonly CdrDuration5X: string;
  /**
   * @usage Extra long duration
   * @design Use sparingly for large UI shifts
   */
  readonly CdrDuration6X: string;
  /**
   * @usage Ease timing curve
   * @design Use for general-purpose animations
   * @alternatives {timing.function-linear}
   */
  readonly CdrTimingFunctionEase: string;
  /**
   * @usage Ease-out timing curve
   * @design Use when animations should decelerate smoothly
   * @alternatives {timing.function-ease}
   */
  readonly CdrTimingFunctionEaseOut: string;
  /**
   * @usage Linear timing curve
   * @design Use for constant-speed animations
   */
  readonly CdrTimingFunctionLinear: string;
}

export declare const CdrMotion: CdrMotionTokens;

export default CdrMotion;