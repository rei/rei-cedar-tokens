const fs = require('fs-extra');

fs.copyFileSync('../dist/json/platform-tokens.json', './src/assets/cdr-tokens.json')
