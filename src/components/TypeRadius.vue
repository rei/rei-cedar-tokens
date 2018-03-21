<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <div class="radius-example" :style="{borderRadius: prop.value}"/>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeRadius',
  props: {
    prop: Object,
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
