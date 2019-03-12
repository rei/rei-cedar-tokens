<template>
  <tr>
    <td>
      <div class="color-example" :style="{backgroundColor: prop.value}"/>
    </td>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
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
    margin: 0 auto;
    border: 1px solid gray;
    border-radius: 2px;
    height: 48px;
    width: 48px;
  }
</style>