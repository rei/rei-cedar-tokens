<template>
  <tr>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
    <td></td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeToken',
  props: {
    prop: Object,
  },
  computed: {
    name() {
      return kebabCase(this.prop.name);
    }
  },
};
</script>

<style>
</style>