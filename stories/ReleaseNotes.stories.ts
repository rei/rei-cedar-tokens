import type { Meta, StoryObj } from '@storybook/html';
import { releaseNotesData } from '../.storybook/generated/release-notes.generated';
import { markdownToHtml } from '../.storybook/release-notes/markdown-to-html';

const meta: Meta = {
  title: 'Release Notes/V14.0.0',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => {
    const html = markdownToHtml(releaseNotesData.markdown);

    return `
      <div class="docs-page cdr-doc-content">
        <article>
          ${html}
          <p class="release-notes-meta">Cedar Tokens is supported one major version back from the current release. For questions or help upgrading, reach out in the <strong>#cedar-user-support</strong> Slack channel.</p>
        </article>
      </div>
    `;
  },
};
