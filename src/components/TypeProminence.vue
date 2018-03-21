<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
    <td>
      <div class="prominence-example" :style="{boxShadow: prop.value}"/>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeProminence',
  props: {
    prop: Object,
  },
};
</script>

<style>
  .prominence-example {
    border: 1px solid black;
    width: 32px;
    height: 32px;
  }
</style>
