import type { Transform } from 'style-dictionary/types';

const toSnakeCase = (str: string) =>
  str
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

export const androidNameTransform: Transform = {
  name: 'name/android-snake',
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

    return `cdr_${toSnakeCase(meaningfulPath.join('_'))}`;
  },
};
