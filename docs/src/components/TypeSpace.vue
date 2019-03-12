<template>
  <tr>
    <td>
      <div class="space-example" :style="{width: prop.value, height: prop.value}"/>
    </td>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeSpace',
  props: {
    prop: Object,
  },
};
</script>

<style>
  .space-example {
    background-color: black;
  }
</style>