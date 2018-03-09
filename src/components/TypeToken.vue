<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
    <td>N/A</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeToken',
  props: {
    prop: Object,
  },
};
</script>

<style>

</style>
