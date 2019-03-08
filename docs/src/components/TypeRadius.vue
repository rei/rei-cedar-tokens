<template>
  <tr>
    <td>
      <div class="radius-example" :style="{borderRadius: prop.value}"/>
    </td>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeRadius',
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
  .radius-example {
    background-color: black;
    width: 32px;
    height: 32px;
  }
</style>