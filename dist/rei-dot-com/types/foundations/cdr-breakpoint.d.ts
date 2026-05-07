export interface CdrBreakpointTokens {
  /**
   * Large breakpoint at 1232px. Use for full desktop layouts.
   * @value 1232
   * @cssvar --cdr-breakpoint-lg
   */
  readonly CdrBreakpointLg: string;
  /**
   * Medium breakpoint at 992px. Use for tablet-landscape and larger layouts.
   * @value 992
   * @cssvar --cdr-breakpoint-md
   */
  readonly CdrBreakpointMd: string;
  /**
   * Small breakpoint at 768px. Use for tablet-portrait and larger layouts.
   * @value 768
   * @cssvar --cdr-breakpoint-sm
   */
  readonly CdrBreakpointSm: string;
  /**
   * The default mobile-first base breakpoint starting at 0px. All styles outside a breakpoint query apply here.
   * @value 0
   * @cssvar --cdr-breakpoint-xs
   */
  readonly CdrBreakpointXs: string;
}

export declare const CdrBreakpoint: CdrBreakpointTokens;

export default CdrBreakpoint;
