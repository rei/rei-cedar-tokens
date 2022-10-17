module.exports = {
  scss: {
    transformGroup: 'custom/scss',
    buildPath: 'dist/scss/',
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/foo',
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin',
      },
      // {
      //   destination: 'cdr-deprecated.scss',
      //   format: 'scss/deprecated',
      // },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map',
      },
    ],
    actions: ['include_media_queries_scss', 'include_display_scss', 'concat_files', 'include_deprecate_scss'],
  },
};
