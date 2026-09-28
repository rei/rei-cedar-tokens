import type { CanonicalRoot } from '../types/canonical-token.js';

export type NormalizeSuccess = { success: true; data: CanonicalRoot };
export type NormalizeError = { success: false; error: string };

export interface TokenDocs {
  summary?: string;
  design?: string;
  usage?: string;
  aliases?: string[];
}

export interface TokenLeaf {
  $value: string | number | boolean;
  $type: string;
  $extensions?: {
    cedar?: {
      docs?: TokenDocs;
      appearances?: Record<string, string>;
      platformOverrides?: Record<string, Record<string, string>>;
      resolved?: Record<string, Record<string, string>>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}
