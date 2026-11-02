/* This file is auto-generated. Do not edit manually. */

export type CdrIntentsType = {
  readonly Primary: {
    readonly surface: string;
    readonly text: string;
    readonly icon: string;
    readonly border: string;
    readonly textEmphasis: string;
  };
  readonly Secondary: {
    readonly surface: string;
    readonly text: string;
    readonly icon: string;
    readonly border: string;
  };
  readonly Brand: {
    readonly surface: string;
    readonly text: string;
    readonly icon: string;
    readonly border: string;
  };
  readonly Link: {
    readonly text: {
      readonly rest: string;
      readonly active: string;
      readonly visited: string;
    };
    readonly border: {
      readonly hover: string;
      readonly active: string;
    };
  };
};

export declare const CdrIntents: CdrIntentsType;
export default CdrIntents;
