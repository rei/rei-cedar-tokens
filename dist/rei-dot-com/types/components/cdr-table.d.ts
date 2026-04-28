export interface CdrTableTokens {
  /**
   * The background color of table headers
   */
  readonly CdrColorBackgroundTableHeader: string;
  /**
   * The background color of table rows
   */
  readonly CdrColorBackgroundTableRow: string;
  /**
   * An alternate row color to aid grouping row data
   */
  readonly CdrColorBackgroundTableRowAlt: string;
  /**
   * The border color of table rows and their corresponding data cells
   */
  readonly CdrColorBorderTableDefault: string;
  /**
   * Border color separating complex table heads
   */
  readonly CdrColorBorderTableHead: string;
}

export declare const CdrTable: CdrTableTokens;

export default CdrTable;