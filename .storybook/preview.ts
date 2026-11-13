import type { Preview } from '@storybook/html-vite';
import { cedarTheme } from './cedar-theme';
import './cedar.scss';
import './_content.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: cedarTheme,
    },
    // Reference pages are static — no addon panel tabs unless a story opts in.
    interactions: { disable: true },
    actions: { disable: true },
    releaseNotes: { disable: true },
    options: {
      storySort: {
        order: [
          'Release Notes',
          'Tokens',
          ['UI Semantics', 'UI Intents', 'Palette'],
          'Guides',
          ['Using tokens'],
          '*',
        ],
      },
    },
    backgrounds: {
      options: {
        'cedar-light': { name: 'cedar-light', value: '#fafbf9' },
        'cedar-primary': { name: 'cedar-primary', value: '#ffffff' },
        'cedar-secondary': { name: 'cedar-secondary', value: '#f7f5f3' },
        'cedar-dark': { name: 'cedar-dark', value: '#2e2e2b' },
        'cedar-spruce': { name: 'cedar-spruce', value: '#1f513f' },
        'cedar-sale': { name: 'cedar-sale', value: '#c7370f' },
      },
    },
    viewport: {
      options: {
        xs: {
          name: 'Extra Small (xs)',
          styles: { width: '320px', height: '568px' },
        },
        sm: {
          name: 'Small (sm)',
          styles: { width: '768px', height: '1024px' },
        },
        md: {
          name: 'Medium (md)',
          styles: { width: '992px', height: '768px' },
        },
        lg: {
          name: 'Large (lg)',
          styles: { width: '1232px', height: '900px' },
        },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'cedar-primary',
    },
  },
};

export default preview;
