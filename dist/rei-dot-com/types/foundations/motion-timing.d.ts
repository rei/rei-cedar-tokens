export interface MotionTimingTokens {
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

export declare const MotionTiming: MotionTimingTokens;

export default MotionTiming;