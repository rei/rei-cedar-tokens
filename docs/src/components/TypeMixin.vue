<template>
  <tr>
    <td></td>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
import kebab from 'lodash/kebabCase';

export default {
  name: 'TypeMixin',
  props: {
    prop: [Array,Object],
  },
  computed: {
    name() {
      return kebab(this.prop.name)
    }
  }
};
</script>

<style>
  .typography-values {
    margin-bottom: 0;
  }
</style>