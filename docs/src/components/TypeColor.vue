<template>
  <tr>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <div class="color-example" :style="{backgroundColor: prop.value}"/>
    </td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeColor',
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
  .color-example {
    height: 32px;
    width: 32px;
  }
</style>