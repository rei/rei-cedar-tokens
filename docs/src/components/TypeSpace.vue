<template>
  <tr>
    <td>
      <div class="space-example" :style="{width: prop.value, height: prop.value}"/>
    </td>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeSpace',
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
  .space-example {
    background-color: black;
  }
</style>