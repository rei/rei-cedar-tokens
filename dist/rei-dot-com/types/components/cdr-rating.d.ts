// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrRatingTokens {
  /**
   * The defaul background color of the rating star icon
   * @value #fafbf9
   * @cssvar --cdr-color-background-rating-star-default
   */
  readonly CdrColorBackgroundRatingStarDefault: string;
  /**
   * Background color for the highlighted rating icon
   * @value #ffd280
   * @cssvar --cdr-color-background-rating-star-highlighted
   */
  readonly CdrColorBackgroundRatingStarHighlighted: string;
  /**
   * Default border color for the unhighlighted rating icon
   * @value #958e83
   * @cssvar --cdr-color-border-rating-star-default
   */
  readonly CdrColorBorderRatingStarDefault: string;
  /**
   * Border color for the highlighted rating icon
   * @value #bd7b2d
   * @cssvar --cdr-color-border-rating-star-highlighted
   */
  readonly CdrColorBorderRatingStarHighlighted: string;
  /**
   * Text color for ratings
   * @value #4b4a48
   * @cssvar --cdr-color-text-rating-default
   */
  readonly CdrColorTextRatingDefault: string;
  /**
   * Text color for the hover state of ratings
   * @value #406eb5
   * @cssvar --cdr-color-text-rating-hover
   */
  readonly CdrColorTextRatingHover: string;
  /**
   * Text color for the separator in ratings
   * @value #b2ab9f
   * @cssvar --cdr-color-text-rating-separator
   */
  readonly CdrColorTextRatingSeparator: string;
}

export declare const CdrRating: CdrRatingTokens;
export default CdrRating;