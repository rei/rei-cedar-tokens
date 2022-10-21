module.exports = {
  less: {
    transformGroup: 'custom/less',
    buildPath: 'dist/less/',
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-variable.less',
        format: 'less/variables',
        filter: 'removeOptions',
        options: {
          showFileHeader: false,
        },
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin',
        options: {
          showFileHeader: false,
        },
      },
    ],
    actions: ['include_media_queries_less', 'include_display_less', 'concat_files'],
  },
};
