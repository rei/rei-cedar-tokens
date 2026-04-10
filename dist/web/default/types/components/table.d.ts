export interface TableTokens {
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
  readonly CdrColorBorderTableRow: string;
  readonly CdrColorTextTablePrimary: string;
  readonly CdrColorTextTableSecondary: string;
  readonly CdrKnockoutColorBackgroundTableHeader: string;
  readonly CdrKnockoutColorBackgroundTableRow: string;
  readonly CdrKnockoutColorBorderTableRow: string;
  readonly CdrKnockoutColorTextTablePrimary: string;
  readonly CdrKnockoutColorTextTableSecondary: string;
}

export declare const Table: TableTokens;

export default Table;
