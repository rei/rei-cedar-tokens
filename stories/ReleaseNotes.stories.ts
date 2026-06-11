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

// Helper to create a story for a release note
const createReleaseNoteStory = (version: string, markdown: string): StoryObj => ({
  name: version,
  render: () => {
    const html = markdownToHtml(markdown);

    return `
      <div class="docs-page cdr-doc-content">
        <article>
          ${html}
          <p class="release-notes-meta">Cedar Tokens is supported one major version back from the current release. For questions or help upgrading, reach out in the <strong>#cedar-user-support</strong> Slack channel.</p>
        </article>
      </div>
    `;
  },
});

// Get all release notes
const allReleaseNotes = releaseNotesData.allReleaseNotes || [];

// Export each version as a named story
// Only actual cedar-tokens releases are exported
export const V14_0_0: StoryObj = createReleaseNoteStory(
  '14.0.0',
  allReleaseNotes.find((rn) => rn.version === '14.0.0')?.markdown || releaseNotesData.markdown,
);

export const V14_0_1: StoryObj = createReleaseNoteStory(
  '14.0.1',
  allReleaseNotes.find((rn) => rn.version === '14.0.1')?.markdown || '',
);
