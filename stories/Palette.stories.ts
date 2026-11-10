import type { StoryObj, Meta } from '@storybook/html-vite';
import {
  chrome,
  sectionHeader,
  internalContractNotice,
  primitiveRamps,
  humanizeFamily,
} from './colors-shared';

const meta: Meta = {
  title: 'Tokens/Palette',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

/** Primitive color ramps — the ref layer, read from source (ADR 0001: not shipped
 *  to consumers). Internal reference only. */
export const Ramps: Story = {
  name: 'Ramps',
  render: () => {
    const ramps = primitiveRamps();

    const sections = ramps
      .map(({ family, steps }) => {
        const swatches = steps
          .map(
            ([step, hex]) => `
            <div class="ramp-step">
              <div class="ramp-step-swatch" style="background:${hex};"></div>
              <div class="ramp-step-label">${step}</div>
              <div class="ramp-hex">${hex}</div>
            </div>`,
          )
          .join('');
        return `
          <div class="ramp-group">
            <p class="ramp-group-label">${humanizeFamily(family)} <span style="font-weight:400;opacity:0.6;">(${steps.length})</span></p>
            <div class="ramp-strip">${swatches}</div>
          </div>`;
      })
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Primitive Ramps', ramps.length, 'Internal reference')}
        ${internalContractNotice()}
        <p class="sb-section-intro">
          The named hue families under <code>color.option.*</code> that every semantic and
          component token resolves from. Not a token API — see the notice above.
        </p>
        ${sections}
      </div>
    </div>`;
  },
};
