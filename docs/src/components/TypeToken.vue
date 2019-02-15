<template>
  <tr>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
    <td>N/A</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeToken',
  props: {
    name: String,
    prop: Object,
  },
};
</script>

<style>
</style>