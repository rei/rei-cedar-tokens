const glob = require('glob');
const requireJSON5 = require('require-json5');
const _ = require('lodash');
const process = require('process');
const dirToJson = require('dir-to-json');
const fs = require('fs');

const files = glob.sync('./tokens/**/*.json5');
const results = [];

const addDelimiter = (a, b) => (a ? `${a}-${b}` : b);

// check if object has a `value` property and if any children also have `value` (style dictionary
// will only process the topmost object with `value`)
const validate = (obj, path = '', to_ret = []) => {
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
    results.push(`  In ${file}:`);
    results.push(`    ${response.join('\r\n    ')}`);
  }
});

if (results.length > 0) {
  console.log('The The following tokens are being skipped:');
  console.log(results.join('\r\n'));
  process.exitCode = 1;
} else {
  console.log('Files successfully validated');
}

// Check if file structure is the same
const validateStructure = async () => {
  const validationFile = 'validate-structure.json';
  const newData = await dirToJson('./dist', { sortType: true });
  let existingData;

  try {
    const raw = fs.readFileSync(validationFile, 'utf8');
    existingData = JSON.parse(raw);
  } catch (err) {
    existingData = null;
  }

  // If no existing data found, create it
  if (!existingData) {
    fs.writeFileSync(validationFile, JSON.stringify(newData));
    console.log('Created new validation data');
    return;
  }

  if (!_.isEqual(existingData, newData)) {
    throw new Error('Structure in dist folder has changed!');
  }

  console.log('Dist data structure has not changed');
};

validateStructure();
