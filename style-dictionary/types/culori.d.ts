declare module 'culori' {
  export type CuloriColor = {
    mode?: string;
    alpha?: number;
    [channel: string]: unknown;
  };

  export function parse(color: string): CuloriColor | undefined;
  export function converter(mode: string): (color: CuloriColor) => CuloriColor | undefined;
}
