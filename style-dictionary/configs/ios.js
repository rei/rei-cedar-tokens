module.exports = {
  android: {
    transformGroup: 'custom/ios',
    buildPath: 'dist/ios/',
    prefix: 'cdr',
    files: [
      {
        destination: "CdrSize.h",
        format: "ios/static.h",
        type: "float",
        className: "CdrSize",
        "filter": {
          "attributes": {
            "category": "size"
          }
        }
      },
      {
        destination: "CdrSize.m",
        format: "ios/static.m",
        type: "float",
        className: "CdrSize",
        "filter": {
          "attributes": {
            "category": "size"
          }
        }
      },
      {
        destination: "CdrColor.h",
        format: "ios/colors.h",
        className: "CdrColor",
        type: "CdrColorName",
        "filter": {
          "attributes": {
            "category": "color"
          }
        }
      },
      {
        destination: "CdrColor.m",
        format: "ios/colors.m",
        className: "CdrColor",
        type: "CdrColorName",
        "filter": {
          "attributes": {
            "category": "color"
          }
        }
      },
      {
        destination: "CdrProperties.h",
        format: "ios/singleton.h",
        className: "CdrProperties"
      },
      {
        destination: "CdrProperties.m",
        format: "ios/singleton.m",
        className: "CdrProperties"
      }
    ],
  },
};
