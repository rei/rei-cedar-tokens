export interface CdrSpaceIconTokens {
  /**
   * @usage Default icon size
   * @design Use for standard UI
   * @alternatives {icon.size-lg}
   * @value 24
   * @cssvar --cdr-icon-size
   */
  readonly CdrIconSize: string;
  /**
   * @usage Large icon size
   * @design Use for prominent UI elements
   * @value 32
   * @cssvar --cdr-icon-size-lg
   */
  readonly CdrIconSizeLg: string;
  /**
   * @usage Icon size for cdr-icon() mixin
   * @design Used in the cdr-icon() SCSS mixin
   * @value 2.4rem
   * @cssvar --cdr-icon-size-mixin
   */
  readonly CdrIconSizeMixin: string;
  /**
   * @usage Small icon size
   * @design Use for dense UI
   * @alternatives {icon.size}
   * @value 16
   * @cssvar --cdr-icon-size-sm
   */
  readonly CdrIconSizeSm: string;
}

export declare const CdrSpaceIcon: CdrSpaceIconTokens;
export default CdrSpaceIcon;