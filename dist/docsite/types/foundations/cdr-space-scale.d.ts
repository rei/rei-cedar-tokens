export interface CdrSpaceScaleTokens {
  /**
   * @usage The smallest fluid spacing step, scaling from 3.2px to 4.8px.
   * @design Use for the tightest gaps between inline elements such as an icon and a label.
   */
  readonly CdrSpaceScale0: string;
  /**
   * @usage Fluid spacing spanning steps 0 to 1, scaling from 3.2px to 6.4px.
   * @design Use when spacing needs to adapt across the range of the two smallest steps.
   * @alternatives {space.scale.0}, {space.scale.1}
   */
  readonly CdrSpaceScale01: string;
  /**
   * @usage Fluid spacing step 1, scaling from 4.8px to 6.4px.
   * @design Use for minimal separation between closely related elements.
   */
  readonly CdrSpaceScale1: string;
  /**
   * @usage Fluid spacing step 2, scaling from 6.4px to 8px.
   * @design Use for small gaps such as between stacked text elements or tight component internals.
   */
  readonly CdrSpaceScale2: string;
  /**
   * @usage Fluid spacing step 3, scaling from 12.8px to 16px. Equivalent to the static base unit.
   * @design Use for spacing between related components such as form fields or list items.
   */
  readonly CdrSpaceScale3: string;
  /**
   * @usage Fluid spacing spanning steps 3 to 4, scaling from 6.4px to 16px.
   * @design Use when spacing needs to adapt broadly between component and section spacing.
   * @alternatives {space.scale.3}, {space.scale.4}
   */
  readonly CdrSpaceScale34: string;
  /**
   * @usage Fluid spacing spanning steps 3 to 5, scaling from 12.8px to 25.6px.
   * @design Use when spacing needs to adapt across a wide range of container sizes.
   * @alternatives {space.scale.3}, {space.scale.4}, {space.scale.5}
   */
  readonly CdrSpaceScale35: string;
  /**
   * @usage Fluid spacing step 4, scaling from 19.2px to 24px.
   * @design Use for spacing between distinct components or content groups.
   */
  readonly CdrSpaceScale4: string;
  /**
   * @usage Fluid spacing step 5, scaling from 25.6px to 32px.
   * @design Use for separation between major content sections.
   */
  readonly CdrSpaceScale5: string;
  /**
   * @usage Fluid spacing step 6, scaling from 38.4px to 48px.
   * @design Use for generous separation between page-level sections.
   */
  readonly CdrSpaceScale6: string;
  /**
   * @usage Fluid spacing step 7, scaling from 51.2px to 64px.
   * @design Use for large layout gaps such as between hero sections and page content.
   */
  readonly CdrSpaceScale7: string;
  /**
   * @usage The largest fluid spacing step, scaling from 76.8px to 96px.
   * @design Use for major page-level separation such as between full-width content blocks.
   */
  readonly CdrSpaceScale8: string;
}

export declare const CdrSpaceScale: CdrSpaceScaleTokens;

export default CdrSpaceScale;