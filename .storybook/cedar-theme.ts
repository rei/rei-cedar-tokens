import { create } from '@storybook/theming';

/**
 * Cedar doc-site theme for Storybook.
 *
 * Color values extracted from cedar-site-nuxt's rei-dot-com-theme.scss
 * so both Storybooks match the production documentation site appearance.
 */
export const cedarTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Cedar Design System',
  brandUrl: 'https://cedar.rei.com',
  brandTarget: '_blank',

  // Chrome colors (sidebar, toolbar)
  colorPrimary: '#1f513f',
  colorSecondary: '#406eb5',

  // UI
  appBg: '#f7f5f3',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#d5cfc3',
  appBorderRadius: 4,

  // Text
  textColor: '#4b4a48',
  textInverseColor: '#fafbf9',
  textMutedColor: '#736e65',

  // Toolbar
  barTextColor: '#736e65',
  barSelectedColor: '#1f513f',
  barHoverColor: '#406eb5',
  barBg: '#ffffff',

  // Inputs
  inputBg: '#ffffff',
  inputBorder: '#958e83',
  inputTextColor: '#2e2e2b',
  inputBorderRadius: 4,

  // Typography
  fontBase: 'Graphik, "Graphik fallback", "Helvetica Neue", sans-serif',
  fontCode: 'Pressura, "Courier New", monospace',
});
