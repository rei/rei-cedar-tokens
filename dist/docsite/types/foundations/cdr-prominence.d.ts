export interface CdrProminenceTokens {
  readonly CdrProminenceElevated: string;
  /**
   * @usage Blur for elevated level
   * @design Use for elevated surfaces needing medium depth
   */
  readonly CdrProminenceElevatedBlur: string;
  /**
   * @usage Color for elevated level
   * @design Use for elevated surfaces needing medium depth
   */
  readonly CdrProminenceElevatedColor: string;
  /**
   * @usage Spread for elevated level
   * @design Use for elevated surfaces needing medium depth
   */
  readonly CdrProminenceElevatedSpread: string;
  /**
   * @usage X for elevated level
   * @design Use for elevated surfaces needing medium depth
   */
  readonly CdrProminenceElevatedX: string;
  /**
   * @usage Y for elevated level
   * @design Use for elevated surfaces needing medium depth
   */
  readonly CdrProminenceElevatedY: string;
  readonly CdrProminenceFlat: string;
  /**
   * @usage Blur for flat level
   * @design Use for flat surfaces needing minimal depth
   */
  readonly CdrProminenceFlatBlur: string;
  /**
   * @usage Color for flat level
   * @design Use for flat surfaces needing minimal depth
   */
  readonly CdrProminenceFlatColor: string;
  /**
   * @usage Spread for flat level
   * @design Use for flat surfaces needing minimal depth
   */
  readonly CdrProminenceFlatSpread: string;
  /**
   * @usage X for flat level
   * @design Use for flat surfaces needing minimal depth
   */
  readonly CdrProminenceFlatX: string;
  /**
   * @usage Y for flat level
   * @design Use for flat surfaces needing minimal depth
   */
  readonly CdrProminenceFlatY: string;
  readonly CdrProminenceFloating: string;
  /**
   * @usage Blur for floating level
   * @design Use for floating surfaces needing strong depth
   */
  readonly CdrProminenceFloatingBlur: string;
  /**
   * @usage Color for floating level
   * @design Use for floating surfaces needing strong depth
   */
  readonly CdrProminenceFloatingColor: string;
  /**
   * @usage Spread for floating level
   * @design Use for floating surfaces needing strong depth
   */
  readonly CdrProminenceFloatingSpread: string;
  /**
   * @usage X for floating level
   * @design Use for floating surfaces needing strong depth
   */
  readonly CdrProminenceFloatingX: string;
  /**
   * @usage Y for floating level
   * @design Use for floating surfaces needing strong depth
   */
  readonly CdrProminenceFloatingY: string;
  readonly CdrProminenceLifted: string;
  /**
   * @usage Blur for lifted level
   * @design Use for lifted surfaces needing dramatic depth
   */
  readonly CdrProminenceLiftedBlur: string;
  /**
   * @usage Color for lifted level
   * @design Use for lifted surfaces needing dramatic depth
   */
  readonly CdrProminenceLiftedColor: string;
  /**
   * @usage Spread for lifted level
   * @design Use for lifted surfaces needing dramatic depth
   */
  readonly CdrProminenceLiftedSpread: string;
  /**
   * @usage X for lifted level
   * @design Use for lifted surfaces needing dramatic depth
   */
  readonly CdrProminenceLiftedX: string;
  /**
   * @usage Y for lifted level
   * @design Use for lifted surfaces needing dramatic depth
   */
  readonly CdrProminenceLiftedY: string;
  readonly CdrProminenceRaised: string;
  /**
   * @usage Blur for raised level
   * @design Use for raised surfaces needing subtle elevation
   */
  readonly CdrProminenceRaisedBlur: string;
  /**
   * @usage Color for raised level
   * @design Use for raised surfaces needing subtle elevation
   */
  readonly CdrProminenceRaisedColor: string;
  /**
   * @usage Spread for raised level
   * @design Use for raised surfaces needing subtle elevation
   */
  readonly CdrProminenceRaisedSpread: string;
  /**
   * @usage X for raised level
   * @design Use for raised surfaces needing subtle elevation
   */
  readonly CdrProminenceRaisedX: string;
  /**
   * @usage Y for raised level
   * @design Use for raised surfaces needing subtle elevation
   */
  readonly CdrProminenceRaisedY: string;
}

export declare const CdrProminence: CdrProminenceTokens;

export default CdrProminence;