export interface CdrMotionTimingTokens {
  /**
   * @usage Ease timing curve
   * @design Use for general-purpose animations
   * @alternatives {timing.function-linear}
   * @value cubic-bezier(0.15, 0, 0.15, 0)
   * @cssvar --cdr-timing-function-ease
   */
  readonly CdrTimingFunctionEase: string;
  /**
   * @usage Ease-out timing curve
   * @design Use when animations should decelerate smoothly
   * @alternatives {timing.function-ease}
   * @value cubic-bezier(0.32, 0.94, 0.60, 1)
   * @cssvar --cdr-timing-function-ease-out
   */
  readonly CdrTimingFunctionEaseOut: string;
  /**
   * @usage Linear timing curve
   * @design Use for constant-speed animations
   * @value cubic-bezier(0, 0, 1, 1)
   * @cssvar --cdr-timing-function-linear
   */
  readonly CdrTimingFunctionLinear: string;
}

export declare const CdrMotionTiming: CdrMotionTimingTokens;

export default CdrMotionTiming;