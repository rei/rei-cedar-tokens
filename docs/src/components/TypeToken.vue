<template>
  <tr>
    <td>{{prop.name}} <b v-if="deprecated">(Deprecated)</b></td>
    <td>{{prop.value}}</td>
    <td></td>
  </tr>
</template>

<script>
export default {
  name: 'TypeToken',
  props: {
    prop: Object,
    deprecated: Boolean,
  },
};
</script>

<style>
</style>