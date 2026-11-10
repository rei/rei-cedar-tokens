/**
 * Storybook smoke test — calls every story's render() and asserts it returns
 * markup without throwing. Render-time failures (undefined vars, bad template
 * logic) still serve HTTP 200 and only surface as an error boundary in the
 * browser — this test catches the class of bug that "compiles fine" misses.
 *
 * Stories here are pure string builders (no DOM at render time), so node env
 * suffices. If a story ever needs a browser, move it to a Playwright spec.
 */
import { describe, it, expect } from 'vitest';
import * as colors from '../../stories/Colors.stories';
import * as intents from '../../stories/Intents.stories';
import * as palette from '../../stories/Palette.stories';

const suites: Record<string, Record<string, unknown>> = {
  'Tokens/UI Semantics': colors as unknown as Record<string, unknown>,
  'Tokens/UI Intents': intents as unknown as Record<string, unknown>,
  'Tokens/Palette': palette as unknown as Record<string, unknown>,
};

describe('storybook render smoke', () => {
  for (const [suite, mod] of Object.entries(suites)) {
    describe(suite, () => {
      const stories = Object.entries(mod).filter(
        ([k, v]) => k !== 'default' && typeof (v as { render?: unknown })?.render === 'function',
      );
      it('has at least one story', () => expect(stories.length).toBeGreaterThan(0));
      for (const [exportName, story] of stories) {
        it(`${exportName} renders without throwing`, () => {
          const s = story as {
            render: (args: Record<string, unknown>) => string;
            args?: Record<string, unknown>;
          };
          const html = s.render(s.args ?? {});
          expect(typeof html).toBe('string');
          expect(html.length).toBeGreaterThan(200);
          expect(html).not.toContain('undefined is not');
          expect(html).not.toContain('[object Object]');
        });
      }
    });
  }
});
