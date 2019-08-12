const _ = require('lodash');

function processProminence(tokens) {
  const returnArr = [];
  tokens.forEach((token) => {
    if (
      _.endsWith(token.name, '-x')
      || _.endsWith(token.name, '-y')
      || _.endsWith(token.name, '-blur')
      || _.endsWith(token.name, '-color')
      || _.endsWith(token.name, '-spread')
    ) return;

    const values = token.value.split(' ', 4);
    const color = token.value.split(values.join(' '))[1].trim();
    const [x, y, blur, spread] = values;

    returnArr.push({
      name: token.name,
      value: [
        {
          x: _.toNumber(x),
          y: _.toNumber(y),
          blur: _.toNumber(blur),
          spread: _.toNumber(spread),
          color,
          path: token.path,
        },
      ],
    });
  });
  return returnArr;
}

function processColor(tokens) {
  const returnArr = [];
  tokens.forEach((token) => {
    let type = '';
    if (token.name.includes('text')) type = 'text';
    if (token.name.includes('icon')) type = 'icon';
    if (token.name.includes('background')) type = 'background';
    if (token.name.includes('border')) type = 'border';

    returnArr.push({
      name: token.name,
      value: token.value,
      type,
      path: token.path,
    });
  });

  return returnArr;
}

function calculateWeight(value) {
  let weight;
  switch (value) {
    case 'normal':
      weight = 6;
      break;
    case 'bold':
      weight = 9;
      break;
    default:
      weight = Math.round(value / 100) * 100; // round to nearest 100
      weight = (weight / 100) + 2; // convert to sketch value
      break;
  }

  return weight;
}

function processText(tokens, prefix) {
  const returnArr = [];
  const mixins = _.groupBy(tokens, 'mixin');
  const names = Object.keys(mixins);
  names.forEach((mixinName) => {
    const newTokenObj = {
      name: _.kebabCase(`${prefix}-${mixinName}`),
      value: {},
    };
    const mixinTokens = mixins[mixinName];

    mixinTokens.forEach((t) => {
      let tokenVal = t.value;
      if (t.property === 'font-weight') {
        tokenVal = calculateWeight(t.value);
        newTokenObj.value.fontWeightOriginal = _.toNumber(t.value) ? _.toNumber(t.value) : t.value;
      }
      if (t.property === 'font-family') {
        tokenVal = t.value.split(',')[0];
      }
      newTokenObj.value[_.camelCase(t.property)] = _.toNumber(tokenVal) ? _.toNumber(tokenVal) : tokenVal;
      newTokenObj.path = t.path;
    });

    returnArr.push(newTokenObj);
  });

  return returnArr;
}

function processSpace(tokens) {
  const returnObj = {};
  const groupedSubCats = _.groupBy(tokens, 'docs.type');
  // groupedSubCats.space = _.filter(groupedSubCats.undefined, o => (!_.endsWith(o.name, 'top-bottom') && !_.endsWith(o.name, 'left-right')));
  // delete groupedSubCats.undefined;
  groupedSubCats.space = groupedSubCats.undefined;
  delete groupedSubCats.undefined;
  const subcats = Object.keys(groupedSubCats);

  subcats.forEach((subcat) => {
    returnObj[subcat] = [];
    const subcatTokens = groupedSubCats[subcat];


    subcatTokens.forEach((token) => {
      if (subcat === 'inset') {
        returnObj[subcat].push({
          name: token.name,
          path: token.path,
          value: token.value.split(' ').map(v => _.toNumber(v)),
        });
      } else {
        returnObj[subcat].push({
          name: token.name,
          path: token.path,
          value: _.toNumber(token.value),
        });
      }
    });
  });


  return returnObj;
}

function processGeneric(tokens) {
  const returnArr = [];

  tokens.forEach((token) => {
    returnArr.push({
      name: token.name,
      value: (_.toNumber(token.value) || token.value === '0') ? _.toNumber(token.value) : token.value,
    });
  });

  return returnArr;
}

module.exports = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'sketch',
    formatter(dictionary, config) {
      const prefix = config.prefix ? `${config.prefix}-` : '';
      const finalObj = {};
      const grouped = _.groupBy(dictionary.allProperties, 'docs.category');
      const categories = Object.keys(grouped);
      categories.forEach((category) => {
        const newCategory = category === 'undefined' ? 'misc' : category;
        const tokenArr = grouped[category];

        if (newCategory === 'prominence') finalObj[newCategory] = processProminence(tokenArr);
        if (newCategory === 'colors') finalObj[newCategory] = processColor(tokenArr);
        if (newCategory === 'text') finalObj[newCategory] = processText(tokenArr, prefix);
        if (newCategory === 'spacing') finalObj[newCategory] = processSpace(tokenArr);

        // TODO: change to else?
        if (newCategory === 'radius'
          || newCategory === 'breakpoints') finalObj[newCategory] = processGeneric(tokenArr);
      });

      return JSON.stringify(finalObj, null, 2);
    },
  });
};
