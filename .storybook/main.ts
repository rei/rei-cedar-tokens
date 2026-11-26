import type { StorybookConfig } from '@storybook/html-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-mcp'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  core: {
    // Maintainer tool — no onboarding checklist or what's-new noise.
    disableWhatsNewNotifications: true,
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      base: process.env.STORYBOOK_BASE_URL ?? config.base ?? '/',
      // Storybook 10.6+ blocks preview requests whose Host header isn't
      // localhost (e.g. 127.0.0.1 previews/proxies) unless allowedHosts is set.
      server: { allowedHosts: true },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern',
            quietDeps: true,
          },
        },
      },
    }),
};

export default config;
