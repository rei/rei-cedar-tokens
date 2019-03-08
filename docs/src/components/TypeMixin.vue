<template>
  <tr>
    <td></td>
    <td>{{prop.name}}</td>
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
};
</script>

<style>
  .typography-values {
    margin-bottom: 0;
  }
</style>