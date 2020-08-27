module.exports = {
  less: {
    transformGroup: 'custom/less',
    buildPath: 'dist/less/',
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-variable.less',
        format: 'less/variables',
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin',
      },
    ],
    actions: ['include_media_queries_less', 'include_display_less', 'concat_files'],
  },
};
