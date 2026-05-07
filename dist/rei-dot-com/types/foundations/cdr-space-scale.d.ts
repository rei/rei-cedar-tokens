export interface CdrSpaceScaleTokens {
  /**
   * @usage The smallest fluid spacing step, scaling from 3.2px to 4.8px.
   * @design Use for the tightest gaps between inline elements such as an icon and a label.
   * @value clamp(0.2rem, 0.2rem + 0.11cqi, 0.3rem)
   * @cssvar --cdr-space-scale-0
   */
  readonly CdrSpaceScale0: string;
  /**
   * @usage Fluid spacing spanning steps 0 to 1, scaling from 3.2px to 6.4px.
   * @design Use when spacing needs to adapt across the range of the two smallest steps.
   * @alternatives {space.scale.0}, {space.scale.1}
   * @value clamp(0.2rem, 0.1rem + 0.223cqi, 0.4rem)
   * @cssvar --cdr-space-scale-01
   */
  readonly CdrSpaceScale01: string;
  /**
   * @usage Fluid spacing step 1, scaling from 4.8px to 6.4px.
   * @design Use for minimal separation between closely related elements.
   * @value clamp(0.3rem, 0.3rem + 0.11cqi, 0.4rem)
   * @cssvar --cdr-space-scale-1
   */
  readonly CdrSpaceScale1: string;
  /**
   * @usage Fluid spacing step 2, scaling from 6.4px to 8px.
   * @design Use for small gaps such as between stacked text elements or tight component internals.
   * @value clamp(0.4rem, 0.4rem + 0.11cqi, 0.5rem)
   * @cssvar --cdr-space-scale-2
   */
  readonly CdrSpaceScale2: string;
  /**
   * @usage Fluid spacing step 3, scaling from 12.8px to 16px. Equivalent to the static base unit.
   * @design Use for spacing between related components such as form fields or list items.
   * @value clamp(0.8rem, 0.7rem + 0.22cqi, 1rem)
   * @cssvar --cdr-space-scale-3
   */
  readonly CdrSpaceScale3: string;
  /**
   * @usage Fluid spacing spanning steps 3 to 4, scaling from 6.4px to 16px.
   * @design Use when spacing needs to adapt broadly between component and section spacing.
   * @alternatives {space.scale.3}, {space.scale.4}
   * @value clamp(0.4rem, 0.2rem + 0.66cqi, 1rem)
   * @cssvar --cdr-space-scale-34
   */
  readonly CdrSpaceScale34: string;
  /**
   * @usage Fluid spacing spanning steps 3 to 5, scaling from 12.8px to 25.6px.
   * @design Use when spacing needs to adapt across a wide range of container sizes.
   * @alternatives {space.scale.3}, {space.scale.4}, {space.scale.5}
   * @value clamp(0.8rem, 0.1404px + 1.21cqi, 1.6rem)
   * @cssvar --cdr-space-scale-35
   */
  readonly CdrSpaceScale35: string;
  /**
   * @usage Fluid spacing step 4, scaling from 19.2px to 24px.
   * @design Use for spacing between distinct components or content groups.
   * @value clamp(1.2rem, 1.1rem + 0.33cqi, 1.5rem)
   * @cssvar --cdr-space-scale-4
   */
  readonly CdrSpaceScale4: string;
  /**
   * @usage Fluid spacing step 5, scaling from 25.6px to 32px.
   * @design Use for separation between major content sections.
   * @value clamp(1.6rem, 1.5rem + 0.44cqi, 2rem)
   * @cssvar --cdr-space-scale-5
   */
  readonly CdrSpaceScale5: string;
  /**
   * @usage Fluid spacing step 6, scaling from 38.4px to 48px.
   * @design Use for generous separation between page-level sections.
   * @value clamp(2.4rem, 2.2rem + 0.66cqi, 3rem)
   * @cssvar --cdr-space-scale-6
   */
  readonly CdrSpaceScale6: string;
  /**
   * @usage Fluid spacing step 7, scaling from 51.2px to 64px.
   * @design Use for large layout gaps such as between hero sections and page content.
   * @value clamp(3.2rem, 2.9rem + 0.88cqi, 4rem)
   * @cssvar --cdr-space-scale-7
   */
  readonly CdrSpaceScale7: string;
  /**
   * @usage The largest fluid spacing step, scaling from 76.8px to 96px.
   * @design Use for major page-level separation such as between full-width content blocks.
   * @value clamp(4.8rem, 4.4rem + 1.31cqi, 6rem)
   * @cssvar --cdr-space-scale-8
   */
  readonly CdrSpaceScale8: string;
}

export declare const CdrSpaceScale: CdrSpaceScaleTokens;

export default CdrSpaceScale;