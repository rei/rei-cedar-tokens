import type { Transform } from 'style-dictionary/types';

const toCamel = (str: string) => str.replace(/[-.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));

export const iosNameTransform: Transform = {
  name: 'name/ios-camel',
  type: 'name',
  transform: (token) => {
    // Token paths for semantic color tokens follow the canonical structure:
    //   color.modes.<palette>.<intent>.<variant>
    //   [0]   [1]   [2]      [3]      [4]
    //
    // Drop the first three segments by position — they are structural scaffolding,
    // not semantic meaning. Dropping by position means new palettes work
    // automatically without updating this file.
    const meaningfulPath =
      token.path[0] === 'color' && token.path[1] === 'modes' ? token.path.slice(3) : token.path;

    return toCamel(meaningfulPath.join('.'));
  },
};
