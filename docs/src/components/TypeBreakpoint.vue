<template>
  <tr>
    <td>{{prop.name}} <b v-if="deprecated">(Deprecated)</b></td>
    <td>{{prop.value}}</td>
    <td>
      <!-- <div class="breakpoint-example" :style="{width: prop.value}"/> -->
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeBreakpoint',
  props: {
    prop: Object,
    deprecated: Boolean,
  },
};
</script>

<style>
  .breakpoint-example {
    background-color: black;
    height: 20px;
  }
</style>