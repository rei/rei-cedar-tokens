import type { Config } from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary';

const webPlatform = (buildPath: string) => ({
  transformGroup: 'cedar/web',
  buildPath,
  actions: ['web-css'],
  files: [],
  filter: (token: TransformedToken) =>
    (token.path[0] === 'color' &&
      token.path[1] === 'modes' &&
      token.path[2] === 'default' &&
      token.$type === 'color') ||
    token.path[0] === 'spacing',
});

const webScssPlatform = (buildPath: string) => ({
  ...webPlatform(buildPath),
  actions: ['web-scss'],
});

export const webConfig: Config = {
  source: ['canonical/tokens.json'],
  log: { verbosity: 'verbose' },
  platforms: {
    web: webPlatform('dist/rei-dot-com/css/'),
    scss: webScssPlatform('dist/rei-dot-com/scss/'),
  },
};

export const docsiteWebConfig: Config = {
  source: ['canonical/tokens.json'],
  log: { verbosity: 'verbose' },
  platforms: {
    web: webPlatform('dist/docsite/css/'),
    scss: webScssPlatform('dist/docsite/scss/'),
  },
};
