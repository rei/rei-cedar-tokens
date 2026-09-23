import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

const SPACE_SCALE_RANGE_NAME_MAP: Record<string, string> = {
  CdrSpaceScale01: 'CdrSpaceScaleRange0To1',
  CdrSpaceScale34: 'CdrSpaceScaleRange3To4',
  CdrSpaceScale35: 'CdrSpaceScaleRange3To5',
};

/**
 * Rewrites ambiguous PascalCase space-scale range names emitted by name/pascal
 * into explicit range identifiers.
 */
export const spaceScaleRangeNames = (sd: typeof StyleDictionary) => {
  sd.registerTransform({
    name: 'name/pascal-space-scale-range',
    type: 'name',
    filter: (token: Token): boolean => token.name in SPACE_SCALE_RANGE_NAME_MAP,
    transform: (token: Token): string => SPACE_SCALE_RANGE_NAME_MAP[token.name] || token.name,
  });
};
