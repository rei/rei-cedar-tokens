import type { Meta, StoryObj } from '@storybook/html';
import { releaseNotesData } from '../.storybook/generated/release-notes.generated';
import { markdownToHtml } from '../.storybook/release-notes/markdown-to-html';

const meta: Meta = {
  title: 'Release Notes/V14.0.0',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => {
    const html = markdownToHtml(releaseNotesData.markdown);

    return `
      <section class="release-notes-shell">
        <article class="release-notes">
          ${html}
          <p class="release-notes-meta">
            Selected file: ${releaseNotesData.selectedFile} | Available files: ${releaseNotesData.availableFiles.length} | Generated: ${releaseNotesData.generatedAt}
          </p>
        </article>
      </section>
    `;
  },
};
