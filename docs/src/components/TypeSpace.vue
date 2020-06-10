<template>
  <tr>
    <td>
      <div class="space-example" :style="{width: prop.value}"/>
    </td>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
export default {
  name: 'TypeSpace',
  props: {
    prop: Object,
    deprecated: Boolean,
  },
};
</script>

<style lang="scss">
  .space-example {
    height: 1px;
    background-color: black;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      height: 5px;
      width: 1px;
      background-color: black;
      top: -2px;
      left: -1px;
    }

    &::after {
      content: '';
      position: absolute;
      height: 5px;
      width: 1px;
      background-color: black;
      top: -2px;
      right: -1px;
    }
  }
</style>