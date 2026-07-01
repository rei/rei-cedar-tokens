import type { StorybookConfig } from '@storybook/html-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
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
