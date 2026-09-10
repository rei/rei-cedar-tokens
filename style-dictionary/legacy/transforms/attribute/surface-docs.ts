import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

interface CedarExtensions {
  cedar?: {
    docs?: Record<string, unknown>;
  };
}

export const surfaceDocs = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'attribute/surface-docs',
    type: 'attribute',
    transform: (token: Token): Record<string, unknown> => {
      if (token.$value !== undefined) {
        const cedarDocs = (token.$extensions as CedarExtensions | undefined)?.cedar?.docs;
        if (cedarDocs) {
          token.docs = cedarDocs;
        }
      }
      return {};
    },
  });
};
