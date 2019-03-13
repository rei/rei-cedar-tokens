<template>
  <tr>
    <td>{{prop.name}}</td>
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
  },
};
</script>

<style>
  .breakpoint-example {
    background-color: black;
    height: 20px;
  }
</style>