<template>
  <tr>
    <td>{{name}}</td>
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
    name: String,
    prop: Object,
  },
};
</script>

<style>
  .color-example {
    height: 32px;
    width: 32px;
  }
</style>