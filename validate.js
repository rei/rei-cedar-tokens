const glob = require('glob');
const requireJSON5 = require('require-json5');
const _ = require('lodash');
const process = require('process');

const files = glob.sync('./tokens/**/*.json5');
const results = [];

const addDelimiter = (a, b) => a ? `${a}-${b}` : b;

// check if object has a `value` property and if any children also have `value` (style dictionary 
// will only process the topmost object with `value`)
const validate = (obj, path='', to_ret=[]) => {
  const hasValue = _.has(obj, 'value');

  for (const key in obj) {
    const value = obj[key];
    const fullPath = addDelimiter(path, key);

    if (hasValue && _.has(value, 'value')) {
      to_ret.push(fullPath);
      validate(value, fullPath, to_ret);
    } else if (_.isPlainObject(value)) {
      validate(value, fullPath, to_ret);
    }
  }

  return to_ret;
};

// Starts here
files.forEach((file) => {
  const response = validate(requireJSON5(file));

  if (response.length > 0) {
    results.push(`  In ${file}:`)
    results.push(`    ${response.join('\r\n    ')}`)
  }
});

if (results.length > 0) {
  console.log('The The following tokens are being skipped:');
  console.log(results.join('\r\n'));
  process.exitCode = 1;
} else {
  console.log('All files successfully validated');
}