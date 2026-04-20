export interface CdrRatingTokens {
  /**
   * The defaul background color of the rating star icon
   */
  readonly CdrColorBackgroundRatingStarDefault: string;
  /**
   * Background color for the highlighted rating icon
   */
  readonly CdrColorBackgroundRatingStarHighlighted: string;
  /**
   * Default border color for the unhighlighted rating icon
   */
  readonly CdrColorBorderRatingStarDefault: string;
  /**
   * Border color for the highlighted rating icon
   */
  readonly CdrColorBorderRatingStarHighlighted: string;
  /**
   * Text color for ratings
   */
  readonly CdrColorTextRatingDefault: string;
  /**
   * Text color for the hover state of ratings
   */
  readonly CdrColorTextRatingHover: string;
  /**
   * Text color for the separator in ratings
   */
  readonly CdrColorTextRatingSeparator: string;
}

export declare const CdrRating: CdrRatingTokens;

export default CdrRating;
