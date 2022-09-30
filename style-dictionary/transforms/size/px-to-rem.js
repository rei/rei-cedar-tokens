const _ =  require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/px-to-rem',
    type: 'value',
    transitive: true,
    matcher(prop) {
      return prop.attributes.category === 'size';
    },
    transformer(prop) {
      // update what this is divided by if body font-size changes in rei-cedar
     if (prop.value.indexOf('rem') === -1){
        const num = (parseFloat(prop.value, 10) / 10);
        const unit = num !== 0 ? 'rem' : ''
        return `${num}${unit}`;
     }
    return prop.value;
    }
  });
};
