<template>
  <tr>
    <td></td>
    <td>{{prop.name}} <b v-if="deprecated">(Deprecated)</b></td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeMixin',
  props: {
    prop: Object,
    deprecated: Boolean,
  },
};
</script>

<style>
  .typography-values {
    margin-bottom: 0;
  }
</style>