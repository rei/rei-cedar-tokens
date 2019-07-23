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
    const color = token.value.split(values.join(' '))[1];
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
    });
  });

  return returnArr;
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

    // text defaults (if we need them)
    // [
    //   { 'font-family': 'serif' },
    //   { 'font-weight': 3 },
    //   { 'font-size': 16 },
    //   { 'line-height': 16p },
    //   { 'text-transform': 'none' },
    //   { 'letter-spacing': 0 },
    //   { 'font-style': undefined },
    //   { 'font-stretch': undefined },
    //   { 'text-underline': undefined },
    // ].forEach((defaultProp) => {
    //   const propKey = Object.keys(defaultProp)[0];

    //   // mixinTokens has the property, use it
    //   if (_.some(mixinTokens, t => propKey === t.property)) {
    //     const theToken = _.find(mixinTokens, t => propKey === t.property);
    //     newTokenObj.value[_.camelCase(propKey)] = theToken.value;
    //   } else {
    //     newTokenObj.value[_.camelCase(propKey)] = defaultProp[propKey];
    //   }
    // });

    mixinTokens.forEach((t) => {
      let tokenVal = _.endsWith(t.value, 'px') ? t.value.slice(0, -2) : t.value;
      if (t.property === 'font-weight') {
        tokenVal = (t.value / 100) - 1;
        newTokenObj.value.fontWeightOriginal = _.toNumber(t.value) ? _.toNumber(t.value) : t.value;
      }
      if (t.property === 'font-family') {
        tokenVal = t.value.split(',')[0];
      }
      newTokenObj.value[_.camelCase(t.property)] = _.toNumber(tokenVal) ? _.toNumber(tokenVal) : tokenVal;
    });

    returnArr.push(newTokenObj);
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
      });

      return JSON.stringify(finalObj, null, 2);
    },
  });
};
