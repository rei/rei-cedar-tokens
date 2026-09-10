// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrPaginationTokens {
  /**
   * Background color for the hover state of pagination
   * @value #fafbf9
   * @cssvar --cdr-color-background-pagination-hover
   */
  readonly CdrColorBackgroundPaginationHover: string;
  /**
   * Background color for the pagination keyline
   * @value #406eb5
   * @cssvar --cdr-color-background-pagination-keyline
   */
  readonly CdrColorBackgroundPaginationKeyline: string;
}

export declare const CdrPagination: CdrPaginationTokens;
export default CdrPagination;