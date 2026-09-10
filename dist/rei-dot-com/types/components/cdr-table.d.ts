// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrTableTokens {
  /**
   * The background color of table headers
   * @value #f7f5f3
   * @cssvar --cdr-color-background-table-header
   */
  readonly CdrColorBackgroundTableHeader: string;
  /**
   * The background color of table rows
   * @value #ffffff
   * @cssvar --cdr-color-background-table-row
   */
  readonly CdrColorBackgroundTableRow: string;
  /**
   * An alternate row color to aid grouping row data
   * @value #fafbf9
   * @cssvar --cdr-color-background-table-row-alt
   */
  readonly CdrColorBackgroundTableRowAlt: string;
  /**
   * The border color of table rows and their corresponding data cells
   * @value #d5cfc3
   * @cssvar --cdr-color-border-table-default
   */
  readonly CdrColorBorderTableDefault: string;
  /**
   * Border color separating complex table heads
   * @value #958e83
   * @cssvar --cdr-color-border-table-head
   */
  readonly CdrColorBorderTableHead: string;
}

export declare const CdrTable: CdrTableTokens;
export default CdrTable;