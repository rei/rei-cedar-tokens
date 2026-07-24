import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

export const iosTextValueTransform = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'value/ios/text',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean =>
      token.path[0] === 'text' &&
      (token.$type === 'fontSize' || token.$type === 'dimension' || token.$type === 'fontFamily'),
    transform: (token: Token): string => {
      if (token.$type === 'fontFamily') {
        return String(token.$value);
      }

      const raw = String(token.$value).replace(/px$/, '');
      const num = parseFloat(raw);

      if (Number.isNaN(num)) {
        return String(token.$value);
      }

      return num.toFixed(1);
    },
  });
};
