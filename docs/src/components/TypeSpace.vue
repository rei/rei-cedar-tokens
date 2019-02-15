<template>
  <tr>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <div class="space-example" :style="{width: prop.value, height: prop.value}"/>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeSpace',
  props: {
    name: String,
    prop: Object,
  },
};
</script>

<style>
  .space-example {
    background-color: black;
  }
</style>