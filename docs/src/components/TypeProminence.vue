<template>
  <tr>
    <td>
      <div class="prominence-example" :style="{boxShadow: prop.value}"/>
    </td>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeProminence',
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
  .prominence-example {
    border: 1px solid black;
    width: 32px;
    height: 32px;
    box-shadow: 0rem 0rem 0rem 0rem #1a1a1a 0.2;
  }
</style>