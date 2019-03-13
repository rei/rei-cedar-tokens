<template>
  <tr>
    <td></td>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeMixin',
  props: {
    prop: Object,
  },
};
</script>

<style>
  .typography-values {
    margin-bottom: 0;
  }
</style>