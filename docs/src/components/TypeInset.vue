<template>
  <tr>
    <td>
      <div class="inset-example" :style="{boxShadow: inset, padding: pad}">{{ name }}</div>
    </td>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeInset',
  props: {
    prop: Object,
  },
  computed: {
    name() {
      return kebabCase(this.prop.name);
    },
    pad() {
      const val = this.prop.value;
      if (val.indexOf(' ') <= 0) {
        return `${val} ${val}`;
      } else if (val.indexOf('*') > 0) {
        let [x, y] = val.split(') '); // eslint-disable-line
        return `${x}) ${y}`;
      }
      const [x, y] = val.split(' ');
      return `${x} ${y}`;
    },
    inset() {
      const val = this.prop.value;
      if (val.indexOf(' ') <= 0) {
        return this.getInset(val, val, `-${val}`, `-${val}`);
      } else if (val.indexOf('*') > 0) {
        let [x, y] = val.split(') '); // eslint-disable-line
        const negx = `${x.slice(0, 5)}-${x.slice(5)})`;
        return this.getInset(`${x})`, y, negx, `-${y}`);
      }
      const [x, y] = val.split(' ');
      return this.getInset(x, y, `-${x}`, `-${y}`);
    },
  },
  methods: {
    getInset(posy, posx, negy, negx) {
      // console.log(posx, posy, negx, negy);
      return `inset ${negx} ${negy} 0 rgb(199, 220, 191), inset ${posx} ${posy} 0 rgb(199, 220, 191)`;
    },
  },
};
</script>

<style>
</style>