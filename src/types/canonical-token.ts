export interface TokenDocumentation {
  summary?: string;
  design?: string;
  usage?: string;
  aliases?: string[];
}

export interface CanonicalTokenExtensions {
  cedar?: {
    docs?: TokenDocumentation;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface CanonicalToken {
  $value: string | number | boolean;
  $type: string;
  $extensions?: CanonicalTokenExtensions;
}

export interface CanonicalTokenGroup {
  [tokenName: string]: CanonicalToken | CanonicalTokenGroup;
}

/** The canonical token root — any number of top-level sections (color, spacing, typography, …) */
export interface CanonicalRoot {
  [section: string]: CanonicalTokenGroup;
}
