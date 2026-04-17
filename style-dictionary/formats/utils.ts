import _ from 'lodash';

/**
 * Recursively maps over an object's values using a mapper function.
 * This is a custom lodash mixin that applies the mapper to each nested plain object.
 *
 * @param obj - The object to recursively map
 * @param mapper - Function that transforms each nested object
 * @returns The transformed object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepMap = <T extends Record<string, any>>(
  obj: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapper: (obj: Record<string, any>) => Record<string, any>,
): T => {
  return mapper(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _.mapValues(obj, (v) => (_.isPlainObject(v) ? deepMap(v as Record<string, any>, mapper) : v)),
  ) as T;
};

/**
 * Registers the deep mixin with lodash.
 * Should be called once during module initialization.
 */
export const registerDeepMixin = (): void => {
  _.mixin({
    deep: deepMap,
  });
};
