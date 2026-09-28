import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

const toCamel = (str: string) => str.replace(/[-.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));

export const iosNameTransform = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'name/ios-camel',
    type: 'name',
    transform: (token: Token): string => toCamel(token.path.join('.')),
  });
};
