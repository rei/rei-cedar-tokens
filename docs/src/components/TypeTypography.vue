<template>
  <tr>
    <td>{{name}} <b v-if="deprecated">(Deprecated)</b></td>
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
    deprecated: Boolean,
  }
};
</script>

<style>
</style>