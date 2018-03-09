<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <div class="color-example" :style="{backgroundColor: prop.value}"/>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeColor',
  props: {
    prop: Object,
  },
};
</script>

<style>
  .color-example {
    padding-bottom: 100%;
  }
</style>
