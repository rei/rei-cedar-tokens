import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

const TEXT_PROPERTY_MAP: Record<string, string> = {
  fontFamily: 'family',
  fontSize: 'size',
  fontStyle: 'style',
  fontWeight: 'weight',
  textTransform: 'transform',
};

export const textShortNames = (sd: typeof StyleDictionary) => {
  sd.registerTransform({
    name: 'attribute/text-short-names',
    type: 'attribute',
    filter: (token: Token): boolean => token.path[0].startsWith('text-'),
    transform: (token: Token): Record<string, unknown> => {
      token.path = token.path.map((segment) => TEXT_PROPERTY_MAP[segment] || segment);
      return {};
    },
  });
};
