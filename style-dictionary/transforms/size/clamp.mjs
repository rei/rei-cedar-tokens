export const cssClamp = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'value/clamp',
    type: 'value',
    transitive: true,
    matcher: (token) =>
      token.$type === 'clamp',
    transform: (token) => {
      const v = token.$value ?? token.value;

      if (typeof v === 'string') return v;

      const { min, ideal, max } = v || {};
      if (!min || !ideal || !max) {
        throw new Error(`Clamp token ${token.name} must have min, ideal, and max values.`);
      }
      
      return `clamp(${min}, ${ideal}, ${max})`;
    },
  });
};

