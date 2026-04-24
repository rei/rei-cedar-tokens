export interface SlideTokens {
  /**
   * @usage Hover background color for slide surfaces
   * @design Use when a slide component is hovered
   * @alternatives {color.background.slide.default}
   */
  readonly CdrColorBackgroundSlideDefault: string;
  /**
   * @usage Default slide background color
   * @design Use for the resting state of slide surfaces.
   */
  readonly CdrColorBackgroundSlideHover: string;
}

export declare const Slide: SlideTokens;

export default Slide;