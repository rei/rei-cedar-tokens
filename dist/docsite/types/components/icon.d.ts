export interface IconTokens {
  /**
   * @usage Default icon size
   * @design Use for standard UI
   * @alternatives {icon.size-lg}
   */
  readonly CdrIconSize: string;
  /**
   * @usage Large icon size
   * @design Use for prominent UI elements
   */
  readonly CdrIconSizeLg: string;
  /**
   * @usage Small icon size
   * @design Use for dense UI
   * @alternatives {icon.size}
   */
  readonly CdrIconSizeSm: string;
}

export declare const Icon: IconTokens;

export default Icon;