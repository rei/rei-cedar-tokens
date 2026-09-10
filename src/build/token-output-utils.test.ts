import { describe, expect, it } from 'vitest';
import type { Dictionary, TransformedToken } from 'style-dictionary/types';
import { getModuleTokensByName, type ModuleDefinition } from './token-output-utils';

describe('getModuleTokensByName', () => {
  it('maps full semantic module token names back to source tokens', () => {
    const moduleDefinition: ModuleDefinition = {
      theme: 'rei-dot-com',
      responsibility: 'foundations',
      moduleFileName: 'cdr-color-text',
      interfaceName: 'CdrColorTextTokens',
      unionTypeName: 'CdrColorTextTokenName',
      matchesToken: (token: TransformedToken) =>
        token.path[0] === 'color' &&
        token.path[1] === 'modes' &&
        token.path[3] === 'text' &&
        token.path.length >= 5,
      getTokenName: (token: TransformedToken) => ['color-text', ...token.path.slice(4)].join('-'),
    };

    const linkHoverToken = {
      path: ['color', 'modes', 'default', 'text', 'link', 'hover'],
      $extensions: {
        cedar: {
          docs: {
            summary: 'Color used for hovered text links',
          },
        },
      },
    } as unknown as TransformedToken;

    const dictionary = {
      allTokens: [linkHoverToken],
    } as unknown as Dictionary;

    const tokensByName = getModuleTokensByName(dictionary, moduleDefinition);

    expect(tokensByName.has('color-text-link-hover')).toBe(true);
    expect((tokensByName.get('color-text-link-hover') as any).$extensions.cedar.docs.summary).toBe(
      'Color used for hovered text links',
    );
  });
});
