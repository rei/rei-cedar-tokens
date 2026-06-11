import type { Meta, StoryObj } from '@storybook/html';
import { releaseNotesData } from '../.storybook/generated/release-notes.generated';
import { markdownToHtml } from '../.storybook/release-notes/markdown-to-html';

const meta: Meta = {
  title: 'Release Notes',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

// Generate a story for each release note version
const allReleaseNotes = releaseNotesData.allReleaseNotes || [];

const stories: Record<string, StoryObj> = {};

for (const releaseNote of allReleaseNotes) {
  const version = releaseNote.version;
  // Replace dots with underscores for valid story names
  const storyName = version.replace(/\./g, '_');

  stories[storyName] = {
    name: version,
    render: () => {
      const html = markdownToHtml(releaseNote.markdown);

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
}

// Export all stories
export const { ...allStories } = stories;
