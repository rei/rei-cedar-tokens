import type { Preview } from '@storybook/html';
import { cedarTheme } from './cedar-theme';
import './cedar.css';

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
    backgrounds: {
      default: 'cedar-light',
      values: [
        { name: 'cedar-light', value: '#fafbf9' },
        { name: 'cedar-primary', value: '#ffffff' },
        { name: 'cedar-secondary', value: '#f7f5f3' },
        { name: 'cedar-dark', value: '#2e2e2b' },
        { name: 'cedar-spruce', value: '#1f513f' },
      ],
    },
    viewport: {
      viewports: {
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
};

export default preview;
