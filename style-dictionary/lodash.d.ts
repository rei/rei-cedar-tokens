/**
 * Type declaration for custom lodash mixin
 * This extends the LoDashStatic interface with the custom `deep` method
 * that was added via _.mixin() in formats/utils.ts
 */
declare module 'lodash' {
  interface LoDashStatic {
    /**
     * Recursively maps over an object's values using a mapper function.
     * The mapper is applied to each nested plain object.
     *
     * @param obj - The object to recursively map
     * @param mapper - Function that transforms each nested object
     * @returns The transformed object
     */
    deep<T extends Record<string, unknown>>(
      obj: T,
      mapper: (obj: Record<string, unknown>) => Record<string, unknown>
    ): Record<string, unknown>;
  }
}

export {};
