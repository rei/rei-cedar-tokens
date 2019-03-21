<template>
  <tr>
    <td>{{name}}</td>
    <td>
      {{prop.value}}
    </td>
    <td>
      part of "{{kebab(prop.mixin)}}" mixin
    </td>
  </tr>
</template>

<script>

export default {
  name: 'TypeTypography',
  props: {
    name: String,
    prop: Object,
  }
};
</script>

<style>
</style>