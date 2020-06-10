<template>
  <tr>
    <td>
      <div class="radius-example" :style="{borderRadius: prop.value}"/>
    </td>
    <td>{{prop.name}} <b v-if="deprecated">(Deprecated)</b></td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeRadius',
  props: {
    prop: Object,
    deprecated: Boolean,
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