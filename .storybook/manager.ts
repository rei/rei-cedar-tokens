import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/manager-api';
import { cedarTheme } from './cedar-theme';
import { ReleaseNotesPanel } from './release-notes/ReleaseNotesPanel';

addons.setConfig({
  theme: cedarTheme,
});

addons.register('rei/release-notes', () => {
  addons.add('rei/release-notes/panel', {
    title: 'Release Notes',
    type: types.PANEL,
    render: ({ active, key }) =>
      React.createElement(
        AddonPanel,
        {
          active,
          key,
        },
        React.createElement(ReleaseNotesPanel),
      ),
  });
});
