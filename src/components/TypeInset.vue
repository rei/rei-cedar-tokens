<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <div class="inset-example" :style="{borderWidth: prop.value}"/>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeInset',
  props: {
    prop: Object,
  },
};
</script>

<style>
  .inset-example {
    border-color: black;
    border-style: solid;
    width: 350px;
    height: 200px;
  }
</style>
