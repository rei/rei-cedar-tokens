import type { StorybookConfig } from '@storybook/html-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      base: process.env.STORYBOOK_BASE_URL ?? config.base ?? '/',
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
