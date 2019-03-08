<template>
  <tr>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <!-- <div class="breakpoint-example" :style="{width: prop.value}"/> -->
    </td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeBreakpoint',
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
  .breakpoint-example {
    background-color: black;
    height: 20px;
  }
</style>